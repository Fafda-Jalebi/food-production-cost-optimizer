import { round2 } from './calculator';

export function analyzeAndOptimizeBatch(economics) {
  const recommendations = [];
  const flags = [];

  const totalCost = economics.totalProductionCost || 1;
  const rawMaterialCost = economics.rawMaterialCost || 0;
  const packagingCost = economics.packagingCost || 0;
  const labourCost = economics.labourCost || 0;
  const energyCost = (economics.energyCost || 0) + (economics.waterUtilitiesCost || 0);
  const overheadCost = economics.overheadCost || 0;
  const wastageCost = economics.wastageCost || 0;
  const marginPct = economics.profitMarginPercentage || 0;
  const batchQty = economics.batchQuantity || 1;

  // 1. High Cost Ingredients Analysis
  const ingredients = economics.ingredients || [];
  if (ingredients.length > 0 && rawMaterialCost > 0) {
    const sortedIngs = [...ingredients].sort((a, b) => b.totalCost - a.totalCost);
    const topIng = sortedIngs[0];
    const topIngShare = (topIng.totalCost / totalCost) * 100;

    if (topIngShare > 20) {
      flags.push({
        type: 'WARNING',
        category: 'Raw Materials',
        title: `High Single Ingredient Concentration (${topIng.name})`,
        message: `${topIng.name} accounts for ${round2(topIngShare)}% of total batch production cost.`
      });

      recommendations.push({
        id: 'rec_ing_bulk',
        category: 'Raw Materials',
        severity: 'HIGH',
        title: `Negotiate Tiered Volume Discount or Dual-Sourcing for ${topIng.name}`,
        impact: `High Cost Impact`,
        estimatedSavingsMin: round2(topIng.totalCost * 0.05),
        estimatedSavingsMax: round2(topIng.totalCost * 0.12),
        actionableSteps: [
          `Review supplier pricing thresholds for ${topIng.name} at batch sizes of ${round2(batchQty * 1.5)} ${economics.unitOfMeasure}.`,
          `Request competitive quotes from alternative accredited suppliers for ${topIng.name}.`,
          `Evaluate minor formulation adjustment if key sensory attributes remain uncompromised.`
        ]
      });
    }
  }

  // 2. Wastage Optimization
  if (economics.wastagePercentage > 5) {
    flags.push({
      type: 'DANGER',
      category: 'Wastage',
      title: `Excessive Process Wastage (${economics.wastagePercentage}%)`,
      message: `Wastage adds ₹${wastageCost} (${economics.costContributions?.wastagePct || 0}% of total cost) to every batch.`
    });

    const targetWastagePct = Math.max(2, economics.wastagePercentage - 3);
    const savingsFromWastage = wastageCost * 0.5;

    recommendations.push({
      id: 'rec_wastage_yield',
      category: 'Process Engineering',
      severity: 'CRITICAL',
      title: `Reduce Process Loss from ${economics.wastagePercentage}% down to ${targetWastagePct}%`,
      impact: `Immediate Cash Retention`,
      estimatedSavingsMin: round2(savingsFromWastage * 0.7),
      estimatedSavingsMax: round2(savingsFromWastage * 1.2),
      actionableSteps: [
        `Calibrate filling and portioning equipment to reduce overfill giveaway.`,
        `Optimize ingredient handling and tank residue recovery prior to CIP cleaning cycles.`,
        `Implement real-time mass balance tracking at raw material receiving vs finished goods yield.`
      ]
    });
  }

  // 3. Packaging Cost Efficiency
  const packagingPct = economics.costContributions?.packagingPct || 0;
  if (packagingPct > 18) {
    flags.push({
      type: 'WARNING',
      category: 'Packaging',
      title: `Packaging Overhead High (${packagingPct}%)`,
      message: `Packaging consumes ₹${packagingCost} per batch, higher than industry benchmark of 10-14%.`
    });

    recommendations.push({
      id: 'rec_packaging_bulk',
      category: 'Packaging',
      severity: 'MEDIUM',
      title: `Transition to Bulk Secondary Packaging or Flexible Pouch Alternatives`,
      impact: `Moderate Savings`,
      estimatedSavingsMin: round2(packagingCost * 0.08),
      estimatedSavingsMax: round2(packagingCost * 0.18),
      actionableSteps: [
        `Consolidate corrugated outer box specifications across product lines for volume discount.`,
        `Explore downgauging plastic film thickness without sacrificing shelf-life or puncture barrier.`
      ]
    });
  }

  // 4. Energy & Utility Intensity
  const energyPct = economics.costContributions?.energyPct || 0;
  if (energyPct > 15) {
    flags.push({
      type: 'INFO',
      category: 'Energy',
      title: `Energy Intensive Process (${energyPct}%)`,
      message: `Thermal processing or refrigeration utilities contribute ₹${energyCost} per batch.`
    });

    recommendations.push({
      id: 'rec_energy_opt',
      category: 'Utilities',
      severity: 'MEDIUM',
      title: `Optimize Batch Heating Schedule & Thermal Energy Recovery`,
      impact: `Energy Cost Reduction`,
      estimatedSavingsMin: round2(energyCost * 0.1),
      estimatedSavingsMax: round2(energyCost * 0.2),
      actionableSteps: [
        `Schedule continuous multi-batch cooking runs to reduce thermal startup losses.`,
        `Install plate heat exchangers for pre-heating feed liquids with pasteurizer effluent.`
      ]
    });
  }

  // 5. Scale & Overhead Efficiency
  if (overheadCost > 0 && batchQty < 2000) {
    const overheadPerUnit = economics.costPerUnit * ((economics.costContributions?.overheadPct || 0) / 100);
    const scaledBatchQty = batchQty * 2;
    const scaledOverheadPerUnit = overheadPerUnit / 2;
    const savingsPerUnit = overheadPerUnit - scaledOverheadPerUnit;
    const totalPotentialSavings = savingsPerUnit * scaledBatchQty;

    recommendations.push({
      id: 'rec_scale_batch',
      category: 'Capacity Planning',
      severity: 'HIGH',
      title: `Double Batch Size from ${batchQty} ${economics.unitOfMeasure} to ${scaledBatchQty} ${economics.unitOfMeasure}`,
      impact: `Fixed Cost Dilution`,
      estimatedSavingsMin: round2(totalPotentialSavings * 0.4),
      estimatedSavingsMax: round2(totalPotentialSavings * 0.8),
      actionableSteps: [
        `Utilize full kettle / mixer capacity to dilute fixed plant overhead and setup labor per kg.`,
        `Consolidate changeover frequency to increase effective equipment availability.`
      ]
    });
  }

  // 6. Margin Health Check
  if (marginPct < 15) {
    flags.push({
      type: 'DANGER',
      category: 'Margin',
      title: `Sub-Optimal Profit Margin (${marginPct}%)`,
      message: `Current profit margin is below target threshold of 25%. Break-even selling price is ₹${economics.breakEvenSellingPrice}/unit.`
    });

    const targetSellingPrice = round2(economics.costPerUnit / 0.7);
    recommendations.push({
      id: 'rec_pricing_opt',
      category: 'Pricing Strategy',
      severity: 'CRITICAL',
      title: `Adjust Target Selling Price from ₹${economics.sellingPricePerUnit} to ₹${targetSellingPrice}`,
      impact: `Margin Expansion to 30%`,
      estimatedSavingsMin: round2((targetSellingPrice - economics.sellingPricePerUnit) * economics.sellableQuantity * 0.5),
      estimatedSavingsMax: round2((targetSellingPrice - economics.sellingPricePerUnit) * economics.sellableQuantity),
      actionableSteps: [
        `Re-position product messaging to reflect premium quality features.`,
        `Introduce multi-pack value sizes to improve net unit price realization.`
      ]
    });
  }

  let totalMinSavings = 0;
  let totalMaxSavings = 0;
  recommendations.forEach(r => {
    totalMinSavings += r.estimatedSavingsMin;
    totalMaxSavings += r.estimatedSavingsMax;
  });

  return {
    flags,
    recommendations,
    summary: {
      healthScore: Math.min(100, Math.max(10, Math.round(100 - (flags.length * 15) + (marginPct > 20 ? 10 : 0)))),
      totalPotentialSavingsMin: round2(totalMinSavings),
      totalPotentialSavingsMax: round2(totalMaxSavings),
      primaryCostDriver: (economics.costContributions?.rawMaterialPct > 50) ? 'Raw Materials' : ((economics.costContributions?.labourPct > 25) ? 'Labour' : 'Overheads & Packaging')
    }
  };
}
