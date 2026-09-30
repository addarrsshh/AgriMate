import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export default function PriceAnalysisView({ selectedCropId, onNavigateToDecision }) {
  const [crops, setCrops] = useState([]);
  const [activeCropId, setActiveCropId] = useState(selectedCropId || 'crop-wheat');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCrops().then(res => {
      if (res.success && res.data) {
        setCrops(res.data);
        if (!activeCropId) setActiveCropId(res.data[0].id);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeCropId) return;
    setLoading(true);
    api.getPriceAnalysis(activeCropId).then(res => {
      if (res.success && res.data) setAnalysis(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [activeCropId]);

  const renderChart = () => {
    if (!analysis?.history?.length) return null;
    const data = analysis.history;
    const W = 640, H = 200, P = 35;
    const prices = data.map(d => d.modalPrice);
    const minV = Math.min(...prices) * 0.98;
    const maxV = Math.max(...prices) * 1.02;
    const getX = i => P + (i / (data.length - 1)) * (W - 2 * P);
    const getY = v => H - P - ((v - minV) / (maxV - minV)) * (H - 2 * P);
    const pts = data.map((d, i) => `${getX(i)},${getY(d.modalPrice)}`).join(' ');
    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[400px]">
          <defs>
            <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="#e2e8f0" />
          <line x1={P} y1={getY(analysis.sma30)} x2={W - P} y2={getY(analysis.sma30)} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1.5" />
          <line x1={P} y1={getY(analysis.sma7)} x2={W - P} y2={getY(analysis.sma7)} stroke="#eab308" strokeWidth="1.5" />
          <polygon points={`${getX(0)},${H - P} ${pts} ${getX(data.length - 1)},${H - P}`} fill="url(#gr)" opacity="0.3" />
          <polyline fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
          {data.map((d, i) => (
            <circle key={i} cx={getX(i)} cy={getY(d.modalPrice)} r={i === data.length - 1 ? 4 : 2} fill="#15803d" stroke="#fff" strokeWidth="1" />
          ))}
          <text x={P} y={H - 8} fill="#64748b" fontSize="10">{data[0]?.date}</text>
          <text x={W - P - 50} y={H - 8} fill="#64748b" fontSize="10">{data.at(-1)?.date} (Today)</text>
          <text x={W - P + 2} y={getY(analysis.sma30) + 3} fill="#94a3b8" fontSize="9">SMA30</text>
          <text x={W - P + 2} y={getY(analysis.sma7) + 3} fill="#ca8a04" fontSize="9">SMA7</text>
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-slate-900">Price Analysis</h1>

      {/* Crop selector pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {crops.map(c => (
          <button key={c.id} onClick={() => setActiveCropId(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCropId === c.id ? 'bg-forest-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-forest-50'
            }`}>
            {c.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="glass-card p-10 rounded-2xl text-center text-slate-500 text-sm">Loading...</div>
      ) : analysis ? (
        <div className="space-y-4">
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Current Rate', val: `₹${analysis.currentPrice}`, sub: 'per quintal' },
              { label: '7-Day Change', val: `${analysis.changePct7d >= 0 ? '+' : ''}${analysis.changePct7d}%`, color: analysis.changePct7d >= 0 ? 'text-emerald-600' : 'text-rose-600', sub: `from ₹${analysis.price7dAgo}` },
              { label: '30-Day Change', val: `${analysis.changePct30d >= 0 ? '+' : ''}${analysis.changePct30d}%`, color: analysis.changePct30d >= 0 ? 'text-emerald-600' : 'text-rose-600', sub: `from ₹${analysis.price30dAgo}` },
              { label: 'Volatility', val: analysis.volatilityLevel, sub: `Index: ${analysis.volatilityIndex}` },
            ].map(m => (
              <div key={m.label} className="glass-card p-4 rounded-xl">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{m.label}</span>
                <div className={`text-2xl font-extrabold mt-1 ${m.color || 'text-slate-900'}`}>{m.val}</div>
                <span className="text-xs text-slate-500">{m.sub}</span>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="glass-card p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">30-Day Price Trend</h3>
                <p className="text-xs text-slate-400">Green = Daily • Yellow = SMA7 • Grey dashed = SMA30</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-forest-100 text-forest-800 text-xs font-semibold">{analysis.trend}</span>
                <button onClick={() => onNavigateToDecision(activeCropId)}
                  className="px-3 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold flex items-center gap-1 transition-all">
                  <ShieldAlert className="w-3.5 h-3.5" /> Sell / Hold
                </button>
              </div>
            </div>
            {renderChart()}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
              <div>Low: <strong className="text-slate-900">₹{analysis.minPrice30d}</strong></div>
              <div>High: <strong className="text-slate-900">₹{analysis.maxPrice30d}</strong></div>
              <div>SMA7: <strong className="text-forest-700">₹{analysis.sma7}</strong></div>
              <div>SMA30: <strong className="text-slate-700">₹{analysis.sma30}</strong></div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
