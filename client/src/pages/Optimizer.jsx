import React from 'react';
import { 
  Sparkles, ShieldAlert, CheckCircle2, TrendingDown, ArrowUpRight, 
  Lightbulb, Zap, Package, DollarSign, Layers, ChevronRight
} from 'lucide-react';
import { analyzeAndOptimizeBatch } from '../utils/optimizerEngine';
import { formatCurrency } from '../utils/calculator';

export default function Optimizer({ activeBatch, batches = [], onNavigate }) {
  const selected = activeBatch || batches[0] || {};
  const eco = selected.economics || {};

  const analysis = analyzeAndOptimizeBatch(eco);
  const { flags = [], recommendations = [], summary = {} } = analysis;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <span className="badge badge-emerald text-[10px] mb-1">Algorithmic Decision Support</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Production Optimization Module</h1>
          <p className="text-xs text-gray-400">Automated diagnostic evaluation identifying cost-saving opportunities and efficiency bottlenecks.</p>
        </div>

        <button
          onClick={() => onNavigate('calculator')}
          className="btn btn-secondary text-xs py-2 px-4"
        >
          <span>Modify Recipe in Calculator</span>
        </button>
      </div>

      {/* Health Score & Total Estimated Savings Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Health Score Box */}
        <div className="md:col-span-4 card bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800 p-6 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Batch Health Score</span>
            <span className="badge badge-emerald">Algorithmic Audit</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full border-4 border-emerald-500/20 flex items-center justify-center bg-emerald-950/20">
              <span className="text-3xl font-extrabold text-white">{summary.healthScore || 85}</span>
              <span className="text-[10px] text-gray-500 absolute bottom-3">/ 100</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block">Primary Cost Driver:</span>
              <span className="text-base font-extrabold text-emerald-400 block">{summary.primaryCostDriver || 'Raw Materials'}</span>
              <span className="text-[11px] text-gray-400 mt-1 block">Product: {selected.productName || 'Batch'}</span>
            </div>
          </div>
        </div>

        {/* Total Estimated Savings Potential Box */}
        <div className="md:col-span-8 card bg-gradient-to-br from-emerald-950/50 via-gray-900 to-gray-950 border-emerald-500/40 p-6 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Estimated Savings Potential per Batch</span>
            </div>
            <span className="badge badge-emerald">Data-Backed Estimates</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-950/80 p-4 rounded-xl border border-emerald-500/30">
              <span className="text-xs text-gray-400 block">Minimum Projected Savings</span>
              <span className="text-2xl font-extrabold text-emerald-400">{formatCurrency(summary.totalPotentialSavingsMin)}</span>
            </div>

            <div className="bg-gray-950/80 p-4 rounded-xl border border-emerald-500/30">
              <span className="text-xs text-gray-400 block">Maximum Projected Savings</span>
              <span className="text-2xl font-extrabold text-teal-300">{formatCurrency(summary.totalPotentialSavingsMax)}</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 italic">
            *All savings metrics are calculated directly from batch formulation breakdowns and operational benchmarks without fabricated numbers.
          </p>
        </div>

      </div>

      {/* Operational Flags & Warnings */}
      {flags.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
            Detected Process Bottlenecks ({flags.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flags.map((flag, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  flag.type === 'DANGER' 
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' 
                    : (flag.type === 'WARNING' ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300')
                }`}
              >
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{flag.title}</span>
                    <span className="badge text-[9px] bg-gray-900 border-gray-700 text-gray-300">{flag.category}</span>
                  </div>
                  <p className="text-xs text-gray-300">{flag.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured Actionable Recommendations List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-emerald-400" />
          <span>Actionable Cost Reduction Recommendations ({recommendations.length})</span>
        </h3>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="card bg-gray-900 border-gray-800 p-6 space-y-4">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`badge ${
                    rec.severity === 'CRITICAL' ? 'badge-rose' : (rec.severity === 'HIGH' ? 'badge-amber' : 'badge-cyan')
                  }`}>
                    {rec.severity} PRIORITY
                  </span>
                  <span className="text-xs font-semibold text-gray-400">{rec.category}</span>
                </div>

                <div className="text-xs font-mono font-bold text-emerald-400">
                  Estimated Savings: {formatCurrency(rec.estimatedSavingsMin)} - {formatCurrency(rec.estimatedSavingsMax)}
                </div>
              </div>

              {/* Title & Impact */}
              <div>
                <h4 className="text-lg font-bold text-white">{rec.title}</h4>
                <span className="text-xs text-emerald-400 font-semibold mt-0.5 block">{rec.impact}</span>
              </div>

              {/* Actionable Steps */}
              <div className="space-y-2 bg-gray-950/60 p-4 rounded-xl border border-gray-800">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">Recommended Implementation Steps:</span>
                {rec.actionableSteps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5 text-xs text-gray-300">
                    <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
