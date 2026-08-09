const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateBatchEconomics, calculateWhatIfScenario } = require('../utils/calculator');

test('Batch Economics Calculation - Mango Jam Preset', () => {
  const input = {
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
      { name: 'Mango Pulp', quantity: 550, unit: 'kg', unitPrice: 85 }, // 46750
      { name: 'Sugar', quantity: 420, unit: 'kg', unitPrice: 42 },      // 17640
      { name: 'Pectin', quantity: 8, unit: 'kg', unitPrice: 750 },      // 6000
      { name: 'Citric Acid', quantity: 4, unit: 'kg', unitPrice: 180 }  // 720
    ]
  };

  const result = calculateBatchEconomics(input);

  // Raw Material Cost: 46750 + 17640 + 6000 + 720 = 71110
  assert.equal(result.rawMaterialCost, 71110);
  
  // Direct variable costs = 71110 + 18000 + 12000 + 6500 + 1500 + 4000 = 113110
  // Wastage cost = 113110 * 0.065 = 7352.15
  assert.equal(result.wastageCost, 7352.15);

  // Total variable cost = 113110 + 7352.15 = 120462.15
  assert.equal(result.totalVariableCost, 120462.15);

  // Total Production Cost = 120462.15 + 10000 = 130462.15
  assert.equal(result.totalProductionCost, 130462.15);

  // Sellable Quantity = 1000 * (1 - 0.065) = 935 kg
  assert.equal(result.sellableQuantity, 935);

  // Cost per unit = 130462.15 / 935 = 139.53
  assert.equal(result.costPerUnit, 139.53);

  // Total Revenue = 935 * 160 = 149600
  assert.equal(result.totalRevenue, 149600);

  // Gross profit = 149600 - 130462.15 = 19137.85
  assert.equal(result.grossProfit, 19137.85);

  // Margin % = (19137.85 / 149600) * 100 = 12.79%
  assert.equal(result.profitMarginPercentage, 12.79);
});

test('What-If Scenario Simulation - 10% Raw Material Price Spike', () => {
  const baseline = {
    batchQuantity: 1000,
    unitOfMeasure: 'kg',
    sellingPricePerUnit: 160,
    packagingCost: 10000,
    labourCost: 10000,
    energyCost: 5000,
    waterUtilitiesCost: 1000,
    transportLogisticsCost: 2000,
    overheadCost: 5000,
    wastagePercentage: 5,
    ingredients: [
      { name: 'Fruit Concentrate', quantity: 500, unit: 'kg', unitPrice: 100 } // 50000
    ]
  };

  const mods = {
    ingredientPriceChangePct: 10 // Raw material goes from 100 to 110/unit
  };

  const sim = calculateWhatIfScenario(baseline, mods);

  assert.ok(sim.scenario.rawMaterialCost > sim.baseline.rawMaterialCost);
  assert.equal(sim.scenario.rawMaterialCost, 55000);
  assert.ok(sim.delta.totalCostChange > 0);
  assert.ok(sim.delta.profitChange < 0);
});
