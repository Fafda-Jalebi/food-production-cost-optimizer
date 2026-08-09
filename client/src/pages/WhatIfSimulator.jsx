import React, { useState } from 'react';
import { 
  Sliders, ArrowUpRight, ArrowDownRight, RefreshCw, 
  TrendingUp, DollarSign, Package, ShieldCheck
} from 'lucide-react';
import { calculateWhatIfScenario, formatCurrency } from '../utils/calculator';

export default function WhatIfSimulator({ activeBatch, batches = [] }) {
  const selectedBaseline = activeBatch || batches[0] || {
    productName: 'Mango Jam Preset',
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
      { name: 'Mango Pulp', quantity: 550, unit: 'kg', unitPrice: 85 },
      { name: 'Sugar', quantity: 420, unit: 'kg', unitPrice: 42 }
    ]
  };

  // Slider State
  const [ingredientPriceChangePct, setIngredientPriceChangePct] = useState(10);
  const [wastageDeltaPct, setWastageDeltaPct] = useState(-2);
  const [batchSizeScalePct, setBatchSizeScalePct] = useState(50);
  const [packagingCostChangePct, setPackagingCostChangePct] = useState(0);
  const [labourCostChangePct, setLabourCostChangePct] = useState(0);
  const [energyCostChangePct, setEnergyCostChangePct] = useState(0);
  const [sellingPriceChangePct, setSellingPriceChangePct] = useState(5);

  const scenarioResult = calculateWhatIfScenario(selectedBaseline, {
    ingredientPriceChangePct,
    wastageDeltaPct,
    batchSizeScalePct,
    packagingCostChangePct,
    labourCostChangePct,
    energyCostChangePct,
    sellingPriceChangePct
  });

  const { baseline, scenario, delta } = scenarioResult;

  const handleReset = () => {
    setIngredientPriceChangePct(0);
    setWastageDeltaPct(0);
    setBatchSizeScalePct(0);
    setPackagingCostChangePct(0);
    setLabourCostChangePct(0);
    setEnergyCostChangePct(0);
    setSellingPriceChangePct(0);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <span className="badge badge-emerald text-[10px] mb-1">Interactive Sandbox</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">What-If Scenario Simulator</h1>
          <p className="text-xs text-gray-400">Simulate market price shocks, process wastage reductions, and scale changes in real-time.</p>
        </div>

        <button
          onClick={handleReset}
          className="btn btn-secondary text-xs py-2 px-4"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* Delta Metrics Top Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Cost Shift */}
        <div className="card space-y-1">
          <span className="text-xs text-gray-400">Total Production Cost Impact</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-white">{formatCurrency(scenario.totalProductionCost)}</span>
            <span className={`badge text-xs ${delta.totalCostChange <= 0 ? 'badge-emerald' : 'badge-rose'}`}>
              {delta.totalCostChange > 0 ? '+' : ''}{delta.totalCostChangePct}%
            </span>
          </div>
          <span className="text-[11px] text-gray-400">
            Baseline: {formatCurrency(baseline.totalProductionCost)} ({delta.totalCostChange > 0 ? '+' : ''}{formatCurrency(delta.totalCostChange)})
          </span>
        </div>

        {/* Unit Cost Shift */}
        <div className="card space-y-1">
          <span className="text-xs text-gray-400">Unit Cost Impact</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-cyan-400">₹{scenario.costPerUnit}</span>
            <span className={`badge text-xs ${delta.costPerUnitChange <= 0 ? 'badge-emerald' : 'badge-rose'}`}>
              {delta.costPerUnitChange > 0 ? '+' : ''}{delta.costPerUnitChangePct}%
            </span>
          </div>
          <span className="text-[11px] text-gray-400">
            Baseline: ₹{baseline.costPerUnit} / {baseline.unitOfMeasure}
          </span>
        </div>

        {/* Profit Shift */}
        <div className="card space-y-1">
          <span className="text-xs text-gray-400">Gross Profit Impact</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-white">{formatCurrency(scenario.grossProfit)}</span>
            <span className={`badge text-xs ${delta.profitChange >= 0 ? 'badge-emerald' : 'badge-rose'}`}>
              {delta.profitChange >= 0 ? '+' : ''}{delta.profitChangePct}%
            </span>
          </div>
          <span className="text-[11px] text-gray-400">
            Baseline: {formatCurrency(baseline.grossProfit)}
          </span>
        </div>

        {/* Margin Shift */}
        <div className="card space-y-1">
          <span className="text-xs text-gray-400">Profit Margin Shift</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-emerald-400">{scenario.profitMarginPercentage}%</span>
            <span className={`badge text-xs ${delta.marginChangePctPoints >= 0 ? 'badge-emerald' : 'badge-amber'}`}>
              {delta.marginChangePctPoints >= 0 ? '+' : ''}{delta.marginChangePctPoints} pts
            </span>
          </div>
          <span className="text-[11px] text-gray-400">
            Baseline Margin: {baseline.profitMarginPercentage}%
          </span>
        </div>

      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sliders Control Panel Left */}
        <div className="lg:col-span-6 card space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400 border-b border-gray-800 pb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            <span>Scenario Variables Controls</span>
          </h3>

          <div className="space-y-5">
            
            {/* Raw Material Price Change */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-300">Ingredient Price Fluctuation (%)</span>
                <span className={ingredientPriceChangePct > 0 ? 'text-rose-400 font-bold' : (ingredientPriceChangePct < 0 ? 'text-emerald-400 font-bold' : 'text-gray-400')}>
                  {ingredientPriceChangePct > 0 ? `+${ingredientPriceChangePct}%` : `${ingredientPriceChangePct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                step="1"
                value={ingredientPriceChangePct}
                onChange={(e) => setIngredientPriceChangePct(Number(e.target.value))}
              />
              <p className="text-[11px] text-gray-500 mt-1">Simulates commodity price spikes or supplier volume discounts.</p>
            </div>

            {/* Wastage Delta */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-300">Wastage Rate Shift (% points)</span>
                <span className={wastageDeltaPct < 0 ? 'text-emerald-400 font-bold' : (wastageDeltaPct > 0 ? 'text-rose-400 font-bold' : 'text-gray-400')}>
                  {wastageDeltaPct > 0 ? `+${wastageDeltaPct}%` : `${wastageDeltaPct}%`} (Current: {Math.max(0, baseline.wastagePercentage + wastageDeltaPct)}%)
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="10"
                step="0.5"
                value={wastageDeltaPct}
                onChange={(e) => setWastageDeltaPct(Number(e.target.value))}
              />
              <p className="text-[11px] text-gray-500 mt-1">Simulates efficiency improvements or yield losses.</p>
            </div>

            {/* Batch Scale Multiplier */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-300">Production Scale Multiplier (%)</span>
                <span className="text-cyan-400 font-bold">
                  {batchSizeScalePct > 0 ? `+${batchSizeScalePct}%` : `${batchSizeScalePct}%`} ({scenario.batchQuantity} {baseline.unitOfMeasure})
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="200"
                step="10"
                value={batchSizeScalePct}
                onChange={(e) => setBatchSizeScalePct(Number(e.target.value))}
              />
              <p className="text-[11px] text-gray-500 mt-1">Evaluates fixed overhead dilution at larger kettle/line volumes.</p>
            </div>

            {/* Selling Price Adjustment */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-300">Selling Price Adjustment (%)</span>
                <span className="text-emerald-400 font-bold">
                  {sellingPriceChangePct > 0 ? `+${sellingPriceChangePct}%` : `${sellingPriceChangePct}%`} (₹{scenario.sellingPricePerUnit})
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                step="1"
                value={sellingPriceChangePct}
                onChange={(e) => setSellingPriceChangePct(Number(e.target.value))}
              />
              <p className="text-[11px] text-gray-500 mt-1">Simulates product price repositioning or retail markups.</p>
            </div>

            {/* Secondary Expenses */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-800">
              <div>
                <label className="input-label text-[10px]">Packaging %</label>
                <input
                  type="number"
                  value={packagingCostChangePct}
                  onChange={(e) => setPackagingCostChangePct(Number(e.target.value))}
                  className="input-field text-xs py-1 px-2"
                />
              </div>
              <div>
                <label className="input-label text-[10px]">Labour %</label>
                <input
                  type="number"
                  value={labourCostChangePct}
                  onChange={(e) => setLabourCostChangePct(Number(e.target.value))}
                  className="input-field text-xs py-1 px-2"
                />
              </div>
              <div>
                <label className="input-label text-[10px]">Energy %</label>
                <input
                  type="number"
                  value={energyCostChangePct}
                  onChange={(e) => setEnergyCostChangePct(Number(e.target.value))}
                  className="input-field text-xs py-1 px-2"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Side-by-Side Comparison Output Right */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="card bg-gray-900 border-gray-800 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Current Scenario vs Modified Scenario
              </h3>
              <span className="badge badge-cyan">Side-by-Side Comparison</span>
            </div>

            <div className="custom-table-container">
              <table className="custom-table text-xs">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Current Baseline</th>
                    <th>Simulated Scenario</th>
                    <th>Variance (Delta)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-semibold text-gray-300">Batch Quantity</td>
                    <td>{baseline.batchQuantity} {baseline.unitOfMeasure}</td>
                    <td className="font-bold text-white">{scenario.batchQuantity} {baseline.unitOfMeasure}</td>
                    <td className="font-mono text-cyan-400">{scenario.batchQuantity - baseline.batchQuantity}</td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-gray-300">Raw Material Cost</td>
                    <td>{formatCurrency(baseline.rawMaterialCost)}</td>
                    <td className="font-bold text-white">{formatCurrency(scenario.rawMaterialCost)}</td>
                    <td className={`font-mono ${scenario.rawMaterialCost <= baseline.rawMaterialCost ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {scenario.rawMaterialCost - baseline.rawMaterialCost > 0 ? '+' : ''}{formatCurrency(scenario.rawMaterialCost - baseline.rawMaterialCost)}
                    </td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-gray-300">Process Loss Wastage</td>
                    <td>{baseline.wastagePercentage}% ({formatCurrency(baseline.wastageCost)})</td>
                    <td className="font-bold text-white">{scenario.wastagePercentage}% ({formatCurrency(scenario.wastageCost)})</td>
                    <td className="font-mono text-amber-400">{scenario.wastagePercentage - baseline.wastagePercentage}% pts</td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-gray-300">Total Production Cost</td>
                    <td>{formatCurrency(baseline.totalProductionCost)}</td>
                    <td className="font-bold text-white">{formatCurrency(scenario.totalProductionCost)}</td>
                    <td className={`font-mono font-bold ${delta.totalCostChange <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {delta.totalCostChange > 0 ? '+' : ''}{formatCurrency(delta.totalCostChange)}
                    </td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-gray-300">Unit Production Cost</td>
                    <td>₹{baseline.costPerUnit} / {baseline.unitOfMeasure}</td>
                    <td className="font-bold text-cyan-400">₹{scenario.costPerUnit} / {baseline.unitOfMeasure}</td>
                    <td className={`font-mono font-bold ${delta.costPerUnitChange <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {delta.costPerUnitChange > 0 ? '+' : ''}₹{delta.costPerUnitChange}
                    </td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-gray-300">Selling Price per Unit</td>
                    <td>₹{baseline.sellingPricePerUnit}</td>
                    <td className="font-bold text-white">₹{scenario.sellingPricePerUnit}</td>
                    <td className="font-mono text-emerald-400">₹{round2(scenario.sellingPricePerUnit - baseline.sellingPricePerUnit)}</td>
                  </tr>

                  <tr className="bg-gray-950/60 font-bold">
                    <td className="text-emerald-400">Net Gross Profit</td>
                    <td>{formatCurrency(baseline.grossProfit)}</td>
                    <td className="text-emerald-400">{formatCurrency(scenario.grossProfit)}</td>
                    <td className={delta.profitChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {delta.profitChange >= 0 ? '+' : ''}{formatCurrency(delta.profitChange)}
                    </td>
                  </tr>

                  <tr className="bg-gray-950/60 font-bold">
                    <td className="text-emerald-400">Profit Margin %</td>
                    <td>{baseline.profitMarginPercentage}%</td>
                    <td className="text-emerald-400">{scenario.profitMarginPercentage}%</td>
                    <td className={delta.marginChangePctPoints >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {delta.marginChangePctPoints >= 0 ? '+' : ''}{delta.marginChangePctPoints}% pts
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

function round2(val) {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}
