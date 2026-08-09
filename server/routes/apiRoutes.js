const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { db } = require('../utils/dbFallback');
const { calculateBatchEconomics, calculateWhatIfScenario } = require('../utils/calculator');
const { analyzeAndOptimizeBatch } = require('../utils/optimizerEngine');
const { generateCostForecast, getSampleForecastData } = require('../utils/forecastEngine');
const { queryAIAdvisor } = require('../utils/aiEngine');
const { authMiddleware, JWT_SECRET } = require('../middleware/authMiddleware');

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await db.createUser({
      name,
      email,
      passwordHash,
      companyName: companyName || 'Food Processors Inc.',
      createdAt: new Date().toISOString()
    });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, companyName: user.companyName }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Guest mode bypass for rapid testing
    if (email === 'guest@demo.com' && password === 'guest123') {
      const token = jwt.sign({ id: 'user_guest', email: 'guest@demo.com', name: 'Guest Operations Manager' }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        token,
        user: { id: 'user_guest', name: 'Guest Operations Manager', email: 'guest@demo.com', companyName: 'Demo Foods Corp' }
      });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, companyName: user.companyName }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/auth/me', authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

// ==========================================
// 2. PRODUCTION COST ENGINE ENDPOINTS
// ==========================================

router.post('/calculate', (req, res) => {
  try {
    const economics = calculateBatchEconomics(req.body);
    res.json({ success: true, data: economics });
  } catch (err) {
    res.status(400).json({ error: 'Calculation failed: ' + err.message });
  }
});

router.post('/whatif/simulate', (req, res) => {
  try {
    const { baseline, modifications } = req.body;
    if (!baseline) {
      return res.status(400).json({ error: 'Baseline batch data is required' });
    }
    const result = calculateWhatIfScenario(baseline, modifications || {});
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ error: 'What-If Simulation failed: ' + err.message });
  }
});

router.post('/optimizer/analyze', (req, res) => {
  try {
    const batchData = req.body;
    const economics = batchData.economics || calculateBatchEconomics(batchData);
    const analysis = analyzeAndOptimizeBatch(economics);
    res.json({ success: true, data: analysis });
  } catch (err) {
    res.status(400).json({ error: 'Optimization analysis failed: ' + err.message });
  }
});

// ==========================================
// 3. AI ADVISOR ENDPOINT
// ==========================================

router.post('/ai/advisor', async (req, res) => {
  try {
    const { question, batchData } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question prompt is required' });
    }

    const batchContext = batchData?.economics ? batchData.economics : calculateBatchEconomics(batchData || {});
    batchContext.productName = batchData?.productName || 'Food Batch';

    const result = await queryAIAdvisor(question, batchContext);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: 'AI Advisor error: ' + err.message });
  }
});

// ==========================================
// 4. BATCH MANAGEMENT ENDPOINTS
// ==========================================

router.get('/batches', authMiddleware, async (req, res) => {
  try {
    const batches = await db.getBatches(req.user.id);
    res.json({ success: true, data: batches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/batches/:id', authMiddleware, async (req, res) => {
  try {
    const batch = await db.getBatchById(req.params.id);
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    res.json({ success: true, data: batch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/batches', authMiddleware, async (req, res) => {
  try {
    if (!req.body.productName || !req.body.batchQuantity) {
      return res.status(400).json({ error: 'Product Name and Batch Quantity are required' });
    }
    const saved = await db.saveBatch({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/batches/:id', authMiddleware, async (req, res) => {
  try {
    const existing = await db.getBatchById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    const updated = await db.saveBatch({
      ...existing,
      ...req.body,
      id: req.params.id,
      userId: req.user.id
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/batches/:id', authMiddleware, async (req, res) => {
  try {
    await db.deleteBatch(req.params.id);
    res.json({ success: true, message: 'Batch deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/batches/:id/duplicate', authMiddleware, async (req, res) => {
  try {
    const existing = await db.getBatchById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    const copy = {
      ...existing,
      id: undefined,
      productName: `${existing.productName} (Copy)`,
      createdAt: new Date().toISOString()
    };
    const saved = await db.saveBatch(copy);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. FORECASTING ENDPOINT
// ==========================================

router.get('/forecast', async (req, res) => {
  try {
    const batches = await db.getBatches();
    const records = batches.map(b => ({
      date: b.createdAt || new Date().toISOString(),
      costPerUnit: b.economics?.costPerUnit || 0,
      totalProductionCost: b.economics?.totalProductionCost || 0,
      productionQuantity: b.batchQuantity || 0,
      rawMaterialCost: b.economics?.rawMaterialCost || 0,
      sellingPrice: b.sellingPricePerUnit || 0
    }));

    if (records.length < 3) {
      return res.json({ success: true, data: getSampleForecastData() });
    }

    const forecast = generateCostForecast(records, 6);
    res.json({ success: true, data: forecast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. SUPPLIER ANALYSIS ENDPOINT
// ==========================================

router.get('/suppliers', async (req, res) => {
  try {
    const suppliers = await db.getSuppliers();
    res.json({ success: true, data: suppliers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/suppliers', authMiddleware, async (req, res) => {
  try {
    const saved = await db.saveSupplier(req.body);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
