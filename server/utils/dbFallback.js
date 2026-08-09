/**
 * Hybrid Persistence Store (MongoDB Mongoose + JSON File Fallback).
 * Ensures zero-config execution even without an active MongoDB server.
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Memory store state
let isMongoConnected = false;
let localStore = {
  users: [],
  batches: [],
  suppliers: [],
  historicalCosts: []
};

// Seed default realistic food processing demo batches
function seedInitialDemoData() {
  const { calculateBatchEconomics } = require('./calculator');

  const demoBatches = [
    {
      id: 'batch_mango_jam_01',
      userId: 'user_demo_01',
      productName: 'Premium Mango Jam',
      productCategory: 'Preserves & Jams',
      batchQuantity: 1000,
      unitOfMeasure: 'kg',
      sellingPricePerUnit: 160,
      packagingCost: 18000,
      labourCost: 12000,
      energyCost: 6500,
      waterUtilitiesCost: 1500,
      transportLogisticsCost: 4000,
      overheadCost: 10000,
      wastagePercentage: 6.5,
      ingredients: [
        { name: 'Mango Pulp (Alphonso)', quantity: 550, unit: 'kg', unitPrice: 85 },
        { name: 'Refined Sugar', quantity: 420, unit: 'kg', unitPrice: 42 },
        { name: 'Pectin (Fruit Grade)', quantity: 8, unit: 'kg', unitPrice: 750 },
        { name: 'Citric Acid', quantity: 4, unit: 'kg', unitPrice: 180 }
      ],
      createdAt: new Date('2026-08-01T10:00:00Z').toISOString()
    },
    {
      id: 'batch_tomato_sauce_02',
      userId: 'user_demo_01',
      productName: 'Classic Tomato Ketchup',
      productCategory: 'Sauces & Condiments',
      batchQuantity: 2000,
      unitOfMeasure: 'kg',
      sellingPricePerUnit: 110,
      packagingCost: 24000,
      labourCost: 18000,
      energyCost: 11000,
      waterUtilitiesCost: 2500,
      transportLogisticsCost: 7500,
      overheadCost: 15000,
      wastagePercentage: 4.8,
      ingredients: [
        { name: 'Tomato Concentrate (28 Brix)', quantity: 1200, unit: 'kg', unitPrice: 52 },
        { name: 'Liquid Glucose & Sugar', quantity: 650, unit: 'kg', unitPrice: 40 },
        { name: 'Vinegar (4% Acidity)', quantity: 110, unit: 'kg', unitPrice: 22 },
        { name: 'Salt & Spices Blend', quantity: 40, unit: 'kg', unitPrice: 65 }
      ],
      createdAt: new Date('2026-08-05T14:30:00Z').toISOString()
    },
    {
      id: 'batch_butter_biscuit_03',
      userId: 'user_demo_01',
      productName: 'Crispy Butter Biscuits',
      productCategory: 'Bakery & Confectionery',
      batchQuantity: 500,
      unitOfMeasure: 'kg',
      sellingPricePerUnit: 220,
      packagingCost: 12000,
      labourCost: 14000,
      energyCost: 9500,
      waterUtilitiesCost: 1200,
      transportLogisticsCost: 3500,
      overheadCost: 9000,
      wastagePercentage: 3.2,
      ingredients: [
        { name: 'Refined Wheat Flour (Maida)', quantity: 260, unit: 'kg', unitPrice: 32 },
        { name: 'Pure Dairy Butter', quantity: 110, unit: 'kg', unitPrice: 420 },
        { name: 'Icing Sugar', quantity: 115, unit: 'kg', unitPrice: 45 },
        { name: 'Baking Powder & Emulsifiers', quantity: 15, unit: 'kg', unitPrice: 120 }
      ],
      createdAt: new Date('2026-08-07T09:15:00Z').toISOString()
    }
  ];

  localStore.batches = demoBatches.map(b => ({
    ...b,
    economics: calculateBatchEconomics(b)
  }));

  localStore.suppliers = [
    {
      id: 'sup_01',
      name: 'AgroFresh Pulps Ltd',
      materialName: 'Mango Pulp (Alphonso)',
      unitPrice: 85,
      unitOfMeasure: 'kg',
      leadTimeDays: 4,
      moq: 500,
      transportCostPerUnit: 3.5,
      qualityRating: 4.8,
      reliabilityScorePct: 96
    },
    {
      id: 'sup_02',
      name: 'Global Fruit Processing Corp',
      materialName: 'Mango Pulp (Alphonso)',
      unitPrice: 79,
      unitOfMeasure: 'kg',
      leadTimeDays: 8,
      moq: 1500,
      transportCostPerUnit: 6.0,
      qualityRating: 4.3,
      reliabilityScorePct: 88
    },
    {
      id: 'sup_03',
      name: 'PureSugar Refineries',
      materialName: 'Refined Sugar',
      unitPrice: 42,
      unitOfMeasure: 'kg',
      leadTimeDays: 2,
      moq: 1000,
      transportCostPerUnit: 1.2,
      qualityRating: 4.9,
      reliabilityScorePct: 99
    }
  ];

  saveLocalStore();
}

function loadLocalStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      localStore = JSON.parse(content);
    } else {
      seedInitialDemoData();
    }
  } catch (e) {
    console.warn('Could not load local JSON store, resetting to initial seed:', e.message);
    seedInitialDemoData();
  }
}

function saveLocalStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(localStore, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write local JSON store:', e.message);
  }
}

async function initializeDatabase() {
  loadLocalStore();

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('ℹ️ MONGODB_URI not set. Running transparently with local JSON database.');
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB successfully.');
    return true;
  } catch (err) {
    console.warn('⚠️ MongoDB connection attempt failed/timed out. Falling back to local JSON database:', err.message);
    isMongoConnected = false;
    return false;
  }
}

// Data Access Helpers
const db = {
  isMongo: () => isMongoConnected,

  // Users
  findUserByEmail: async (email) => {
    return localStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  createUser: async (userObj) => {
    const newUser = { ...userObj, id: 'user_' + Date.now() };
    localStore.users.push(newUser);
    saveLocalStore();
    return newUser;
  },

  // Batches
  getBatches: async (userId) => {
    return localStore.batches;
  },
  getBatchById: async (id) => {
    return localStore.batches.find(b => b.id === id);
  },
  saveBatch: async (batchData) => {
    const { calculateBatchEconomics } = require('./calculator');
    const id = batchData.id || 'batch_' + Date.now();
    const economics = calculateBatchEconomics(batchData);

    const fullBatch = {
      ...batchData,
      id,
      economics,
      updatedAt: new Date().toISOString(),
      createdAt: batchData.createdAt || new Date().toISOString()
    };

    const existingIdx = localStore.batches.findIndex(b => b.id === id);
    if (existingIdx >= 0) {
      localStore.batches[existingIdx] = fullBatch;
    } else {
      localStore.batches.unshift(fullBatch);
    }
    saveLocalStore();
    return fullBatch;
  },
  deleteBatch: async (id) => {
    localStore.batches = localStore.batches.filter(b => b.id !== id);
    saveLocalStore();
    return true;
  },

  // Suppliers
  getSuppliers: async () => {
    return localStore.suppliers;
  },
  saveSupplier: async (supplierObj) => {
    const id = supplierObj.id || 'sup_' + Date.now();
    const full = { ...supplierObj, id };
    const idx = localStore.suppliers.findIndex(s => s.id === id);
    if (idx >= 0) {
      localStore.suppliers[idx] = full;
    } else {
      localStore.suppliers.push(full);
    }
    saveLocalStore();
    return full;
  }
};

module.exports = {
  initializeDatabase,
  db
};
