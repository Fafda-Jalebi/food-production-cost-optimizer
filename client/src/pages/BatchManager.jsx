import React, { useState } from 'react';
import { 
  Layers, Search, Copy, Trash2, Eye, Plus, ArrowRight, 
  GitCompare, CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '../utils/calculator';

export default function BatchManager({ 
  batches = [], 
  onSelectBatch, 
  onNavigate, 
  onDuplicateBatch, 
  onDeleteBatch 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  
  // Comparison Modal state
  const [compareBatchA, setCompareBatchA] = useState(batches[0]?.id || '');
  const [compareBatchB, setCompareBatchB] = useState(batches[1]?.id || batches[0]?.id || '');
  const [showCompareModal, setShowCompareModal] = useState(false);

  const categories = ['ALL', ...Array.from(new Set(batches.map(b => b.productCategory || 'General')))];

  const filtered = batches.filter(b => {
    const matchesSearch = b.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || b.productCategory === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const bA = batches.find(b => b.id === compareBatchA) || batches[0] || {};
  const bB = batches.find(b => b.id === compareBatchB) || batches[1] || {};
  const ecoA = bA.economics || {};
  const ecoB = bB.economics || {};

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <span className="badge badge-emerald text-[10px] mb-1">Batch Management System</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Production Batch Directory</h1>
          <p className="text-xs text-gray-400">Manage, duplicate, edit, and perform batch-to-batch comparative economic audits.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {batches.length >= 2 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="btn btn-secondary text-xs py-2 px-3 border-cyan-500/40 text-cyan-300"
            >
              <GitCompare className="w-4 h-4 text-cyan-400" />
              <span>Compare Batch A vs Batch B</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('calculator')}
            className="btn btn-primary text-xs py-2 px-4 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create Batch</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-900 p-4 rounded-xl border border-gray-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 text-xs py-2"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-gray-400 font-semibold shrink-0">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field text-xs py-2 bg-gray-950 border-gray-800"
          >
            {categories.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((b) => {
          const eco = b.economics || {};
          return (
            <div key={b.id} className="card bg-gray-900 border-gray-800 p-5 space-y-4 flex flex-col justify-between">
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    {b.productCategory || 'General Food'}
                  </span>
                  <span className="badge badge-emerald">{b.batchQuantity} {b.unitOfMeasure}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{b.productName}</h3>
              </div>

              <div className="space-y-2 bg-gray-950/60 p-3 rounded-lg border border-gray-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Production Cost:</span>
                  <span className="font-bold text-white font-mono">{formatCurrency(eco.totalProductionCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Unit Production Cost:</span>
                  <span className="font-bold text-cyan-400 font-mono">₹{eco.costPerUnit} / {b.unitOfMeasure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gross Margin:</span>
                  <span className={`font-bold ${eco.profitMarginPercentage >= 20 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {eco.profitMarginPercentage}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                <button
                  onClick={() => { onSelectBatch(b); onNavigate('calculator'); }}
                  className="flex-1 btn btn-secondary text-xs py-2"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View / Edit</span>
                </button>

                <button
                  onClick={() => onDuplicateBatch(b.id)}
                  className="btn btn-secondary text-xs p-2"
                  title="Duplicate Batch"
                >
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                </button>

                <button
                  onClick={() => onDeleteBatch(b.id)}
                  className="btn btn-danger text-xs p-2"
                  title="Delete Batch"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-cyan-400" />
                  <span>Batch-to-Batch Delta Audit</span>
                </h3>
                <p className="text-xs text-gray-400">Compare financial parameters between two production batches.</p>
              </div>
              <button 
                onClick={() => setShowCompareModal(false)}
                className="btn btn-secondary text-xs p-2"
              >
                ✕ Close
              </button>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Batch A</label>
                <select
                  value={compareBatchA}
                  onChange={(e) => setCompareBatchA(e.target.value)}
                  className="input-field text-xs bg-gray-950"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.productName} ({b.batchQuantity} {b.unitOfMeasure})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Batch B</label>
                <select
                  value={compareBatchB}
                  onChange={(e) => setCompareBatchB(e.target.value)}
                  className="input-field text-xs bg-gray-950"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.productName} ({b.batchQuantity} {b.unitOfMeasure})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison Matrix Table */}
            <div className="custom-table-container">
              <table className="custom-table text-xs">
                <thead>
                  <tr>
                    <th>Economic Metric</th>
                    <th>Batch A: {bA.productName}</th>
                    <th>Batch B: {bB.productName}</th>
                    <th>Variance (B vs A)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-semibold text-gray-300">Batch Quantity</td>
                    <td>{bA.batchQuantity} {bA.unitOfMeasure}</td>
                    <td>{bB.batchQuantity} {bB.unitOfMeasure}</td>
                    <td className="font-mono text-cyan-400">{(bB.batchQuantity || 0) - (bA.batchQuantity || 0)}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-gray-300">Total Production Cost</td>
                    <td>{formatCurrency(ecoA.totalProductionCost)}</td>
                    <td>{formatCurrency(ecoB.totalProductionCost)}</td>
                    <td className="font-mono font-bold text-emerald-400">
                      {formatCurrency((ecoB.totalProductionCost || 0) - (ecoA.totalProductionCost || 0))}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-gray-300">Unit Cost</td>
                    <td className="text-cyan-400 font-bold">₹{ecoA.costPerUnit} / {bA.unitOfMeasure}</td>
                    <td className="text-cyan-400 font-bold">₹{ecoB.costPerUnit} / {bB.unitOfMeasure}</td>
                    <td className="font-mono font-bold text-cyan-400">
                      ₹{Math.round(((ecoB.costPerUnit || 0) - (ecoA.costPerUnit || 0)) * 100) / 100}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-gray-300">Gross Margin %</td>
                    <td className="text-emerald-400 font-bold">{ecoA.profitMarginPercentage}%</td>
                    <td className="text-emerald-400 font-bold">{ecoB.profitMarginPercentage}%</td>
                    <td className="font-mono font-bold text-amber-400">
                      {Math.round(((ecoB.profitMarginPercentage || 0) - (ecoA.profitMarginPercentage || 0)) * 10) / 10} pts
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
