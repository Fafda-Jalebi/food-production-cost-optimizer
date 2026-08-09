import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Calendar, AlertCircle, Download, RefreshCw, 
  Info, BarChart2, CheckCircle2
} from 'lucide-react';
import { getSampleForecastData } from '../utils/forecastEngine';
import { formatCurrency } from '../utils/calculator';

export default function Forecasting() {
  const [forecastData, setForecastData] = useState(getSampleForecastData());
  const [loading, setLoading] = useState(false);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/forecast');
      const data = await res.json();
      if (data.success) {
        setForecastData(data.data);
      }
    } catch (err) {
      console.warn('Backend forecast fetch failed, using client statistical generator:', err.message);
      setForecastData(getSampleForecastData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const { historicalPoints = [], forecastPoints = [], analytics = {} } = forecastData;

  const handleExportCSV = () => {
    const rows = [
      ['Date', 'Type', 'Cost Per Unit (₹)', 'Lower Bound (₹)', 'Upper Bound (₹)'],
      ...historicalPoints.map(p => [p.monthLabel, 'Actual Historical', p.actualCostPerUnit, '', '']),
      ...forecastPoints.map(p => [p.monthLabel, 'Statistical Forecast', p.projectedCostPerUnit, p.lowerConfidenceBound, p.upperConfidenceBound])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `food_cost_forecast_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <span className="badge badge-cyan text-[10px] mb-1">Time-Series Predictive Analytics</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Production Cost Forecasting</h1>
          <p className="text-xs text-gray-400">Statistical forecasting utilizing Holt's exponential smoothing and linear trend regression.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchForecast}
            disabled={loading}
            className="btn btn-secondary text-xs py-2 px-3"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Model</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="btn btn-primary text-xs py-2 px-4 shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Export Forecast CSV</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="card space-y-1">
          <span className="text-xs text-gray-400">Model Methodology</span>
          <div className="text-sm font-extrabold text-white">Hybrid Holt & Linear Regression</div>
          <span className="text-[11px] text-gray-500">Dual Exponential Smoothing</span>
        </div>

        <div className="card space-y-1">
          <span className="text-xs text-gray-400">Annualized Cost Inflation Rate</span>
          <div className="text-2xl font-extrabold text-amber-400">+{analytics.annualizedCostInflationPct}% / yr</div>
          <span className="text-[11px] text-gray-500">Based on historical trend</span>
        </div>

        <div className="card space-y-1">
          <span className="text-xs text-gray-400">Confidence Interval</span>
          <div className="text-2xl font-extrabold text-emerald-400">{analytics.confidenceIntervalPct}% Confidence</div>
          <span className="text-[11px] text-gray-500">Standard Error: ₹{analytics.standardError}</span>
        </div>

        <div className="card space-y-1">
          <span className="text-xs text-gray-400">Data Source Status</span>
          <div className="flex items-center gap-2">
            <span className={`badge ${forecastData.isSampleData ? 'badge-amber' : 'badge-emerald'}`}>
              {forecastData.isSampleData ? 'Sample Industry Demo Dataset' : 'Active Batch History'}
            </span>
          </div>
          <span className="text-[11px] text-gray-500">Clearly labeled estimate projections</span>
        </div>

      </div>

      {/* Visual Chart Grid */}
      <div className="card space-y-6">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Historical Unit Production Cost Trend & 6-Month Projections</span>
            </h3>
            <p className="text-xs text-gray-400">Actual unit production costs (Historical) vs Projected Future Costs (Confidence Interval)</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Actual Historical
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" /> Projected Forecast
            </span>
          </div>
        </div>

        {/* Visual Bar Time Series Plot */}
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-6 sm:grid-cols-12 lg:grid-cols-18 gap-2 items-end h-64 bg-gray-950/80 p-4 rounded-xl border border-gray-800 overflow-x-auto">
            
            {/* Historical Bars */}
            {historicalPoints.map((hp, idx) => {
              const maxVal = 140;
              const heightPct = Math.min(100, Math.max(10, (hp.actualCostPerUnit / maxVal) * 100));
              return (
                <div key={`h_${idx}`} className="flex flex-col items-center gap-2 h-full justify-end group min-w-[40px]">
                  <span className="text-[10px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{hp.actualCostPerUnit}
                  </span>
                  <div 
                    className="w-full bg-emerald-500/80 hover:bg-emerald-400 rounded-t-sm transition-all" 
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] text-gray-500 truncate w-full text-center">{hp.monthLabel.split(' ')[0]}</span>
                </div>
              );
            })}

            {/* Forecast Bars */}
            {forecastPoints.map((fp, idx) => {
              const maxVal = 140;
              const heightPct = Math.min(100, Math.max(10, (fp.projectedCostPerUnit / maxVal) * 100));
              return (
                <div key={`f_${idx}`} className="flex flex-col items-center gap-2 h-full justify-end group min-w-[40px]">
                  <span className="text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{fp.projectedCostPerUnit}
                  </span>
                  <div 
                    className="w-full bg-cyan-500/60 hover:bg-cyan-400 rounded-t-sm border border-dashed border-cyan-300 transition-all" 
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] text-cyan-400 truncate w-full text-center font-bold">{fp.monthLabel.split(' ')[0]}</span>
                </div>
              );
            })}

          </div>
        </div>
      </div>

      {/* Detailed Forecast Projection Table */}
      <div className="card space-y-4">
        <h3 className="text-base font-bold text-white border-b border-gray-800 pb-3">
          Detailed Projection Schedule & Upper/Lower Bounds
        </h3>

        <div className="custom-table-container">
          <table className="custom-table text-xs">
            <thead>
              <tr>
                <th>Forecast Month</th>
                <th>Status</th>
                <th>Projected Unit Cost (₹)</th>
                <th>95% Lower Bound (₹)</th>
                <th>95% Upper Bound (₹)</th>
                <th>Expected Impact</th>
              </tr>
            </thead>
            <tbody>
              {forecastPoints.map((fp, idx) => (
                <tr key={idx}>
                  <td className="font-bold text-white">{fp.monthLabel}</td>
                  <td><span className="badge badge-cyan text-[9px]">Projected Estimate</span></td>
                  <td className="font-bold font-mono text-cyan-400">₹{fp.projectedCostPerUnit} / kg</td>
                  <td className="font-mono text-emerald-400">₹{fp.lowerConfidenceBound}</td>
                  <td className="font-mono text-amber-400">₹{fp.upperConfidenceBound}</td>
                  <td className="text-gray-400">
                    +{Math.round((fp.projectedCostPerUnit - (historicalPoints[historicalPoints.length - 1]?.actualCostPerUnit || 90)) * 100) / 100} ₹ variance
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
