import { round2 } from './calculator';

export function getSampleForecastData() {
  const baseDate = new Date('2025-08-01');
  const historicalPoints = [];
  const baseCost = 85.0;

  for (let i = 0; i < 12; i++) {
    const d = new Date(baseDate);
    d.setMonth(d.getMonth() + i);
    const monthStr = d.toISOString().slice(0, 7);
    const monthLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
    
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
