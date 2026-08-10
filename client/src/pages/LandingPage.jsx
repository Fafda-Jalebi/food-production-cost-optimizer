import React, { useState } from 'react';
import { 
  Factory, ArrowRight, CheckCircle2, Sliders, Sparkles, Bot, 
  TrendingUp, Truck, ShieldCheck, DollarSign, PieChart, Activity, Cpu, Play
} from 'lucide-react';
import { formatCurrency, calculateBatchEconomics } from '../utils/calculator';
import { SAMPLE_BATCH_PRESETS } from '../utils/sampleData';

export default function LandingPage({ onLaunchApp, onSelectPreset }) {
  // Interactive mini-calculator state on landing page
  const [quickBatchQty, setQuickBatchQty] = useState(1000);
  const [quickRawPrice, setQuickRawPrice] = useState(85);
  const [quickWastagePct, setQuickWastagePct] = useState(5);
  const [quickSellingPrice, setQuickSellingPrice] = useState(150);

  const quickEconomics = calculateBatchEconomics({
    batchQuantity: quickBatchQty,
    unitOfMeasure: 'kg',
    sellingPricePerUnit: quickSellingPrice,
    packagingCost: 15000,
    labourCost: 12000,
    energyCost: 6000,
    waterUtilitiesCost: 1500,
    transportLogisticsCost: 3500,
    overheadCost: 8000,
    wastagePercentage: quickWastagePct,
    ingredients: [
      { name: 'Primary Raw Material', quantity: quickBatchQty * 0.55, unit: 'kg', unitPrice: quickRawPrice },
      { name: 'Secondary Sweetener / Base', quantity: quickBatchQty * 0.40, unit: 'kg', unitPrice: 40 }
    ]
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 selection:bg-emerald-500 selection:text-black">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-gray-950/20 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Food Processing Economics</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Master & Optimize Your <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Food Production Economics
              </span>
            </h1>

            <p className="text-lg text-gray-400 font-normal leading-relaxed">
              Stop guessing batch margins. A complete decision-support system designed for food processing businesses, production managers, and food tech experts to calculate total costs, simulate what-if scenarios, mitigate process wastage, and leverage AI optimization.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onLaunchApp('dashboard')}
                className="btn btn-primary text-base px-8 py-3 rounded-xl shadow-lg shadow-emerald-950/50 group"
              >
                <span>Launch Interactive App</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onLaunchApp('calculator')}
                className="btn btn-secondary text-base px-6 py-3 rounded-xl"
              >
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>Try Quick Calculator</span>
              </button>
            </div>

            {/* Quick Badges */}
            <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Deterministic Math Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AI Operational Advisor</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Statistical Cost Forecasting</span>
              </div>
            </div>

          </div>

          {/* Interactive Live Sandbox Preview Card */}
          <div className="mt-16 bg-gray-900/90 border border-gray-800 rounded-2xl p-6 lg:p-8 shadow-2xl backdrop-blur-xl relative w-full max-w-full min-w-0">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-gray-400 ml-2">Live Economic Sandbox Engine</span>
              </div>
              <span className="badge badge-emerald">Instant Calculation</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-w-0">
              
              {/* Controls Column */}
              <div className="lg:col-span-6 space-y-5 min-w-0">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-400" />
                  <span>Adjust Batch Parameters</span>
                </h3>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1 text-gray-300">
                    <span>Batch Quantity (kg)</span>
                    <span className="text-emerald-400 font-bold">{quickBatchQty} kg</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={quickBatchQty}
                    onChange={(e) => setQuickBatchQty(Number(e.target.value))}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1 text-gray-300">
                    <span>Primary Raw Material Price (₹/kg)</span>
                    <span className="text-emerald-400 font-bold">₹{quickRawPrice}/kg</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="200"
                    step="5"
                    value={quickRawPrice}
                    onChange={(e) => setQuickRawPrice(Number(e.target.value))}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1 text-gray-300">
                    <span>Process Wastage (% loss)</span>
                    <span className="text-amber-400 font-bold">{quickWastagePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={quickWastagePct}
                    onChange={(e) => setQuickWastagePct(Number(e.target.value))}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1 text-gray-300">
                    <span>Selling Price (₹/kg)</span>
                    <span className="text-cyan-400 font-bold">₹{quickSellingPrice}/kg</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="300"
                    step="5"
                    value={quickSellingPrice}
                    onChange={(e) => setQuickSellingPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Live Output Metrics */}
              <div className="lg:col-span-6 bg-gray-950/80 border border-gray-800 rounded-xl p-6 space-y-4 w-full min-w-0 max-w-full">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-b border-gray-800 pb-3 min-w-0">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Calculated Metrics</span>
                  <span className="text-xs text-emerald-400 font-mono whitespace-nowrap">100% Real-Time</span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 min-w-0">
                  <div className="bg-gray-900/60 p-2.5 sm:p-3 rounded-lg border border-gray-800 min-w-0 overflow-hidden">
                    <span className="text-[11px] text-gray-400 block">Total Batch Cost</span>
                    <span className="text-sm sm:text-xl font-extrabold text-white block break-words">{formatCurrency(quickEconomics.totalProductionCost)}</span>
                  </div>

                  <div className="bg-gray-900/60 p-2.5 sm:p-3 rounded-lg border border-gray-800 min-w-0 overflow-hidden">
                    <span className="text-[11px] text-gray-400 block">Cost Per Sellable Unit</span>
                    <span className="text-sm sm:text-xl font-extrabold text-emerald-400 block break-words">₹{quickEconomics.costPerUnit} / kg</span>
                  </div>

                  <div className="bg-gray-900/60 p-2.5 sm:p-3 rounded-lg border border-gray-800 min-w-0 overflow-hidden">
                    <span className="text-[11px] text-gray-400 block">Gross Profit</span>
                    <span className={`text-sm sm:text-xl font-extrabold block break-words ${quickEconomics.grossProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatCurrency(quickEconomics.grossProfit)}
                    </span>
                  </div>

                  <div className="bg-gray-900/60 p-2.5 sm:p-3 rounded-lg border border-gray-800 min-w-0 overflow-hidden">
                    <span className="text-[11px] text-gray-400 block">Gross Margin %</span>
                    <span className={`text-sm sm:text-xl font-extrabold block break-words ${quickEconomics.profitMarginPercentage >= 20 ? 'text-emerald-400' : (quickEconomics.profitMarginPercentage > 0 ? 'text-amber-400' : 'text-rose-400')}`}>
                      {quickEconomics.profitMarginPercentage}%
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-gray-300 flex items-center justify-between gap-2 min-w-0">
                  <span className="text-gray-400 min-w-0 break-words">Break-Even Selling Price:</span>
                  <span className="font-bold text-white whitespace-nowrap">₹{quickEconomics.breakEvenSellingPrice} / kg</span>
                </div>

                <button
                  onClick={() => onLaunchApp('whatif')}
                  className="w-full btn btn-primary text-xs py-2.5 whitespace-nowrap"
                >
                  Open Full What-If Simulator &rarr;
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="py-20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Built for Food Manufacturing Precision</h2>
            <p className="text-gray-400 text-sm">Every module is engineered specifically for batch processing dynamics, raw material yield loss, and operational profitability.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="card card-interactive space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Full Cost Breakdown</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Itemize raw materials, secondary packaging, direct labour, thermal energy, water utilities, logistics, fixed overheads, and process wastage losses.
              </p>
            </div>

            <div className="card card-interactive space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">What-If Simulator</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Test inflation spikes, wastage reduction, packaging cost changes, and batch scaling multipliers side-by-side with real-time delta waterfall charts.
              </p>
            </div>

            <div className="card card-interactive space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Production Optimizer</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Algorithmic diagnostic engine that flags single-ingredient concentration risks, excessive wastage loss, and low margin thresholds with estimated savings.
              </p>
            </div>

            <div className="card card-interactive space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Cost Advisor</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Ask operational questions in plain language. Integrates with LLMs (Gemini/OpenAI) and includes an intelligent rule-based offline fallback.
              </p>
            </div>

            <div className="card card-interactive space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Statistical Forecasting</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Project future unit costs and margins using Double Exponential Smoothing and Linear Regression with 95% confidence bounds.
              </p>
            </div>

            <div className="card card-interactive space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Supplier Landed Cost Analysis</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Compare multi-supplier quotes accounting for unit price, transport logistics cost, MOQ thresholds, lead times, and quality trade-offs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Preset Recipe Sampler */}
      <section className="py-20 bg-gray-950/60 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="badge badge-emerald mb-2">Pre-Loaded Presets</span>
              <h2 className="text-3xl font-extrabold text-white">Industry Food Processing Models</h2>
              <p className="text-sm text-gray-400">Explore pre-configured batch economics for popular food processing categories.</p>
            </div>
            <button 
              onClick={() => onLaunchApp('calculator')} 
              className="btn btn-secondary text-xs"
            >
              Explore All Presets &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_BATCH_PRESETS.slice(0, 3).map((p, idx) => {
              const eco = calculateBatchEconomics(p);
              return (
                <div key={p.id} className="card bg-gray-900 border-gray-800 p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">{p.productCategory}</span>
                      <h4 className="text-lg font-bold text-white">{p.productName}</h4>
                    </div>
                    <span className="badge badge-cyan">{p.batchQuantity} {p.unitOfMeasure}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-2 border-t border-gray-800">
                    <span className="text-gray-400">Unit Production Cost:</span>
                    <span className="font-bold text-white">₹{eco.costPerUnit} / {p.unitOfMeasure}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Gross Margin:</span>
                    <span className={`font-bold ${eco.profitMarginPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{eco.profitMarginPercentage}%</span>
                  </div>
                  <button
                    onClick={() => onSelectPreset(p)}
                    className="w-full btn btn-secondary text-xs mt-2 py-2"
                  >
                    Load Model in Calculator
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-900 bg-gray-950 text-gray-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold">
              F
            </div>
            <span className="font-heading font-bold text-white text-sm">Food Production Cost Optimizer</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Senior Portfolio Engineering Project. Production-Ready Decision Support System.</p>
          <div className="flex gap-4">
            <span className="hover:text-emerald-400 cursor-pointer" onClick={() => onLaunchApp('dashboard')}>App Dashboard</span>
            <span className="hover:text-emerald-400 cursor-pointer" onClick={() => onLaunchApp('calculator')}>Calculator</span>
            <span className="hover:text-emerald-400 cursor-pointer" onClick={() => onLaunchApp('forecasting')}>Forecasting</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
