/**
 * Statistical Cost Forecasting Engine.
 * Uses Double Exponential Smoothing (Holt's Linear Trend) & Linear Regression
 * to forecast future production costs, unit prices, and margins.
 */

const { round2 } = require('./calculator');

function generateCostForecast(historicalRecords = [], forecastMonths = 6) {
  // Defensive check for empty or small dataset
  if (!Array.isArray(historicalRecords) || historicalRecords.length === 0) {
    return getSampleForecastData();
  }

  // Sort chronological by date
  const sorted = [...historicalRecords].sort((a, b) => new Date(a.date) - new Date(b.date));
  const n = sorted.length;

  const dates = sorted.map(r => r.date);
  const costs = sorted.map(r => Number(r.costPerUnit) || 0);
  const rawMaterialCosts = sorted.map(r => Number(r.rawMaterialCost) || 0);
  const quantities = sorted.map(r => Number(r.productionQuantity) || 0);

  // Perform Linear Regression for Trend
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += costs[i];
    sumXY += i * costs[i];
    sumXX += i * i;
  }

  const slope = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) : 0;
  const intercept = n > 1 ? (sumY - slope * sumX) / n : (costs[0] || 100);

  // Holt's Double Exponential Smoothing (alpha=0.3, beta=0.1)
  const alpha = 0.3;
  const beta = 0.1;

  let level = costs[0] || 100;
  let trend = n > 1 ? costs[1] - costs[0] : 0;

  for (let i = 1; i < n; i++) {
    const value = costs[i];
    const prevLevel = level;
    level = alpha * value + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
  }

  // Calculate Standard Error for Confidence Intervals
  let sumSquaredErr = 0;
  for (let i = 0; i < n; i++) {
    const fitted = intercept + slope * i;
    sumSquaredErr += Math.pow(costs[i] - fitted, 2);
  }
  const stdErr = Math.sqrt(sumSquaredErr / Math.max(1, n - 2));

  // Project future periods
  const lastDate = new Date(dates[dates.length - 1] || Date.now());
  const forecastPoints = [];

  for (let h = 1; h <= forecastMonths; h++) {
    const futureDate = new Date(lastDate);
    futureDate.setMonth(futureDate.getMonth() + h);

    const projectedCostHolt = level + h * trend;
    const projectedCostLinear = intercept + slope * (n - 1 + h);
    const projectedCost = Math.max(0, (projectedCostHolt + projectedCostLinear) / 2);

    const marginOfError = 1.96 * stdErr * Math.sqrt(1 + (1 / n) + Math.pow(h, 2) / 12);
    const lowerBound = Math.max(0, projectedCost - marginOfError);
    const upperBound = projectedCost + marginOfError;

    forecastPoints.push({
      date: futureDate.toISOString().slice(0, 7), // YYYY-MM
      monthLabel: futureDate.toLocaleString('default', { month: 'short', year: 'numeric' }),
      projectedCostPerUnit: round2(projectedCost),
      lowerConfidenceBound: round2(lowerBound),
      upperConfidenceBound: round2(upperBound),
      isForecast: true
    });
  }

  const historicalPoints = sorted.map(r => ({
    date: r.date.slice(0, 7),
    monthLabel: new Date(r.date).toLocaleString('default', { month: 'short', year: 'numeric' }),
    actualCostPerUnit: round2(r.costPerUnit),
    actualTotalCost: round2(r.totalProductionCost),
    productionQuantity: round2(r.productionQuantity),
    rawMaterialCost: round2(r.rawMaterialCost),
    sellingPrice: round2(r.sellingPrice),
    isForecast: false
  }));

  const avgInflationRatePct = round2((slope / Math.max(1, costs[0])) * 100 * 12); // Annualized

  return {
    isSampleData: false,
    historicalPoints,
    forecastPoints,
    analytics: {
      trendDirection: slope > 0.05 ? 'INCREASING' : (slope < -0.05 ? 'DECREASING' : 'STABLE'),
      annualizedCostInflationPct: avgInflationRatePct,
      forecastModel: "Hybrid Holt Exponential Smoothing & Linear Trend Regression",
      confidenceIntervalPct: 95,
      standardError: round2(stdErr)
    }
  };
}

function getSampleForecastData() {
  const baseDate = new Date('2025-08-01');
  const historicalPoints = [];
  const baseCost = 85.0;

  for (let i = 0; i < 12; i++) {
    const d = new Date(baseDate);
    d.setMonth(d.getMonth() + i);
    const monthStr = d.toISOString().slice(0, 7);
    const monthLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    // Simulate real food processing cost trend with seasonal fluctuation
    const seasonal = Math.sin(i * 0.5) * 3.5;
    const trend = i * 1.25;
    const noise = (Math.random() - 0.5) * 2.0;
    const costPerUnit = baseCost + trend + seasonal + noise;
    const batchQty = 1000 + Math.floor(Math.random() * 200);
    const sellingPrice = 140;

    historicalPoints.push({
      date: monthStr,
      monthLabel,
      actualCostPerUnit: round2(costPerUnit),
      actualTotalCost: round2(costPerUnit * batchQty),
      productionQuantity: batchQty,
      rawMaterialCost: round2(costPerUnit * batchQty * 0.55),
      sellingPrice,
      isForecast: false
    });
  }

  const lastDate = new Date('2026-08-01');
  const forecastPoints = [];
  const lastCost = historicalPoints[historicalPoints.length - 1].actualCostPerUnit;

  for (let h = 1; h <= 6; h++) {
    const d = new Date(lastDate);
    d.setMonth(d.getMonth() + h);
    const monthStr = d.toISOString().slice(0, 7);
    const monthLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    const projected = lastCost + h * 1.35;
    const stdErr = 3.2;
    const margin = 1.96 * stdErr * Math.sqrt(1 + (h / 6));

    forecastPoints.push({
      date: monthStr,
      monthLabel,
      projectedCostPerUnit: round2(projected),
      lowerConfidenceBound: round2(projected - margin),
      upperConfidenceBound: round2(projected + margin),
      isForecast: true
    });
  }

  return {
    isSampleData: true,
    historicalPoints,
    forecastPoints,
    analytics: {
      trendDirection: 'INCREASING',
      annualizedCostInflationPct: 8.4,
      forecastModel: "Hybrid Holt Exponential Smoothing & Linear Trend Regression (Sample Demo Dataset)",
      confidenceIntervalPct: 95,
      standardError: 3.2
    }
  };
}

module.exports = {
  generateCostForecast,
  getSampleForecastData
};
