/**
 * AI Production Cost Advisor Engine.
 * Supports external LLM integration (Gemini / OpenAI) with deterministic offline fallback.
 */

const { round2 } = require('./calculator');

async function queryAIAdvisor(userQuestion, batchContext = {}) {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openAiApiKey = process.env.OPENAI_API_KEY;

  // Build structured prompt context
  const structuredPrompt = buildStructuredPrompt(userQuestion, batchContext);

  // If Gemini API Key is provided, attempt call
  if (geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here') {
    try {
      const response = await callGeminiAPI(geminiApiKey, structuredPrompt);
      if (response) {
        return {
          answer: response,
          mode: 'GEMINI_AI',
          status: 'SUCCESS'
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, defaulting to intelligent rule engine:', err.message);
    }
  }

  // If OpenAI API Key is provided, attempt call
  if (openAiApiKey && openAiApiKey !== 'your_openai_api_key_here') {
    try {
      const response = await callOpenAIAPI(openAiApiKey, structuredPrompt);
      if (response) {
        return {
          answer: response,
          mode: 'OPENAI_AI',
          status: 'SUCCESS'
        };
      }
    } catch (err) {
      console.warn('OpenAI API call failed, defaulting to intelligent rule engine:', err.message);
    }
  }

  // Graceful Fallback Mode (Deterministic Rule & Analytical Engine)
  const offlineAdvice = generateOfflineAIResponse(userQuestion, batchContext);
  return {
    answer: offlineAdvice,
    mode: 'DEMO_OFFLINE_AI',
    status: 'SUCCESS'
  };
}

function buildStructuredPrompt(question, batch) {
  return `You are a Senior Food Processing Operations & Economics Expert Advisor.
Analyze the following production batch data and answer the user's operational query concisely with actionable steps.

Product Name: ${batch.productName || 'Food Product'}
Batch Quantity: ${batch.batchQuantity || 1000} ${batch.unitOfMeasure || 'kg'}
Total Production Cost: ₹${batch.totalProductionCost || 0}
Cost Per Unit: ₹${batch.costPerUnit || 0}
Selling Price: ₹${batch.sellingPricePerUnit || 0}
Gross Profit Margin: ${batch.profitMarginPercentage || 0}%
Break-even Quantity: ${batch.breakEvenQuantity || 0} units

Cost Breakdown (%):
- Raw Materials: ${batch.costContributions?.rawMaterialPct || 0}%
- Packaging: ${batch.costContributions?.packagingPct || 0}%
- Labour: ${batch.costContributions?.labourPct || 0}%
- Energy & Utilities: ${batch.costContributions?.energyPct || 0}%
- Logistics: ${batch.costContributions?.logisticsPct || 0}%
- Overhead: ${batch.costContributions?.overheadPct || 0}%
- Wastage Loss: ${batch.costContributions?.wastagePct || 0}% (${batch.wastagePercentage || 0}% loss)

User Question: "${question}"

Provide a structured, professional recommendation covering:
1. Executive Summary & Root Cause Analysis
2. Primary Cost Driver Insights
3. Specific Actionable Steps to Reduce Cost / Improve Margin
4. Estimated Financial Impact`;
}

function generateOfflineAIResponse(question, batch) {
  const q = (question || '').toLowerCase();
  const rawPct = batch.costContributions?.rawMaterialPct || 50;
  const wastagePct = batch.wastagePercentage || 5;
  const marginPct = batch.profitMarginPercentage || 20;
  const costPerUnit = batch.costPerUnit || 85;
  const sellingPrice = batch.sellingPricePerUnit || 120;
  const productName = batch.productName || 'Food Product';

  if (q.includes('reduce') || q.includes('cut cost') || q.includes('lower')) {
    return `### 💡 Operational Cost Reduction Plan for ${productName}

Based on the batch metrics, your total unit production cost is **₹${costPerUnit}**. Here is your top 3 prioritized action plan:

1. **Address Raw Material Concentration (${rawPct}% of Total Cost)**:
   - Raw materials represent your single largest expenditure (₹${batch.rawMaterialCost || 0}). Negotiating a **5-8% volume discount** or exploring dual-sourcing for primary ingredients will yield immediate savings of **₹${round2((batch.rawMaterialCost || 0) * 0.06)} per batch**.

2. **Mitigate Process Wastage (${wastagePct}% Yield Loss)**:
   - Currently, wastage costs **₹${batch.wastageCost || 0}**. Reducing yield loss by 2% via tighter filling tolerance and automated scrap recovery saves **₹${round2((batch.wastageCost || 0) * 0.4)} per batch**.

3. **Packaging Optimization (${batch.costContributions?.packagingPct || 12}%)**:
   - Review outer carton box specs and transition from multi-layer laminate to standard high-barrier pouch film to lower unit packaging cost by 10%.`;
  }

  if (q.includes('why') && (q.includes('high') || q.includes('expensive'))) {
    return `### 🔍 Cost Driver Diagnostic for ${productName}

Your unit cost (₹${costPerUnit}) is primarily driven by:
- **Raw Material Expense**: Represents **${rawPct}%** of total expenses.
- **Process Loss**: **${wastagePct}%** wastage adds ₹${batch.wastageCost || 0} to batch cost.
- **Fixed Plant Overhead**: Represents **${batch.costContributions?.overheadPct || 10}%**.

**Key Finding**: Increasing your batch size from ${batch.batchQuantity || 1000} ${batch.unitOfMeasure || 'kg'} to ${batch.batchQuantity ? batch.batchQuantity * 1.5 : 1500} ${batch.unitOfMeasure || 'kg'} will dilute fixed plant overhead and bring unit cost down from ₹${costPerUnit} to **₹${round2(costPerUnit * 0.91)}**.`;
  }

  if (q.includes('margin') || q.includes('profit') || q.includes('improve')) {
    return `### 📈 Profit Margin Enhancement Strategy

Current Margin: **${marginPct}%** (Gross Profit: ₹${batch.grossProfit || 0} per batch).

To achieve a benchmark target margin of **30%**:
1. **Target Selling Price**: Increasing selling price from ₹${sellingPrice} to **₹${round2(costPerUnit / 0.7)}** expands gross margin to 30%.
2. **Batch Scale Multiplier**: Increasing batch volume dilutes fixed overheads by up to **₹${round2(costPerUnit * 0.07)}/unit**.
3. **Yield Loss Reduction**: Cut wastage from ${wastagePct}% to 3% to reclaim ₹${round2((batch.wastageCost || 0) * 0.5)} per batch directly to net margin.`;
  }

  // Default response
  return `### 🤖 AI Operational Analysis for ${productName}

**Current Batch Snapshot**:
- Production Unit Cost: **₹${costPerUnit}** / ${batch.unitOfMeasure || 'kg'}
- Gross Profit Margin: **${marginPct}%**
- Break-Even Selling Price: **₹${batch.breakEvenSellingPrice || costPerUnit}**
- Primary Expenditure: **Raw Materials (${rawPct}%)** & **Labour (${batch.costContributions?.labourPct || 15}%)**

**Recommendation Summary**:
- **Focus Area 1**: Supplier contract re-negotiation for high-volume raw materials.
- **Focus Area 2**: Process yield improvement to lower wastage below 3%.
- **Focus Area 3**: Scale production volume to optimize machine utilization and energy consumption per unit.`;
}

async function callGeminiAPI(apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

async function callOpenAIAPI(apiKey, prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.choices?.[0]?.message?.content || null;
}

module.exports = {
  queryAIAdvisor
};
