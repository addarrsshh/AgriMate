import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { api } from '../services/api';

export default function SellHoldDecisionView({ selectedCropId }) {
  const [crops, setCrops] = useState([]);
  const [cropId, setCropId] = useState(selectedCropId || 'crop-wheat');
  const [storageDays, setStorageDays] = useState(30);
  const [rainForecast, setRainForecast] = useState(false);
  const [decisionData, setDecisionData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getCrops().then(res => {
      if (res.success && res.data) {
        setCrops(res.data);
        if (!cropId) setCropId(res.data[0].id);
      }
    }).catch(() => {});
  }, []);

  const evaluateDecision = async () => {
    if (!cropId) return;
    setLoading(true);
    try {
      const res = await api.getSellHoldDecision({ cropId, storageDaysRemaining: storageDays, hasSevereRainForecast: rainForecast });
      if (res.success && res.data) setDecisionData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (cropId) evaluateDecision(); }, [cropId, storageDays, rainForecast]);

  const getStyle = (d) => {
    if (d === 'SELL') return { bg: 'bg-rose-600', text: 'text-white', label: 'SELL' };
    if (d === 'HOLD') return { bg: 'bg-emerald-600', text: 'text-white', label: 'HOLD' };
    return { bg: 'bg-amber-500', text: 'text-slate-900', label: 'MONITOR' };
  };

  const style = decisionData ? getStyle(decisionData.decision) : null;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-slate-900">Sell / Hold / Monitor Advisor</h1>

      {/* Controls */}
      <div className="glass-card p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Crop</label>
          <select value={cropId} onChange={e => setCropId(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500">
            {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Storage Days Remaining</label>
          <input type="number" min="1" max="180" value={storageDays}
            onChange={e => setStorageDays(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50">
          <input type="checkbox" checked={rainForecast} onChange={e => setRainForecast(e.target.checked)}
            className="w-4 h-4 text-forest-600 rounded" />
          <span className="text-xs font-semibold text-slate-800">Heavy Rain in 48h?</span>
        </label>
      </div>

      {loading ? (
        <div className="glass-card p-10 rounded-2xl text-center text-slate-500 text-sm">Evaluating...</div>
      ) : decisionData && style ? (
        <div className="space-y-4">
          {/* Decision Banner */}
          <div className={`p-6 rounded-2xl ${style.bg} ${style.text} shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
            <div>
              <div className="text-4xl font-black tracking-tight">{style.label}</div>
              <p className="text-sm opacity-90 mt-1">{decisionData.cropName}</p>
            </div>
            <div className="bg-black/20 p-4 rounded-xl text-center min-w-[110px]">
              <div className="text-xs font-semibold opacity-80">Confidence</div>
              <div className="text-3xl font-extrabold">{decisionData.confidenceScore}%</div>
            </div>
          </div>

          {/* 4 Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Current Price', val: `₹${decisionData.currentPrice}/qtl` },
              { label: '7-Day SMA', val: `₹${decisionData.sma7}/qtl` },
              { label: '30-Day SMA', val: `₹${decisionData.sma30}/qtl` },
              { label: '7-Day Change', val: `${decisionData.priceChangePct7d >= 0 ? '+' : ''}${decisionData.priceChangePct7d}%`, color: decisionData.priceChangePct7d >= 0 ? 'text-emerald-600' : 'text-rose-600' }
            ].map(m => (
              <div key={m.label} className="glass-card p-3.5 rounded-xl">
                <span className="text-xs text-slate-500 block">{m.label}</span>
                <strong className={`text-lg font-bold ${m.color || 'text-slate-900'}`}>{m.val}</strong>
              </div>
            ))}
          </div>

          {/* Rationale + Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-5 rounded-2xl">
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Rationale
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {decisionData.reasons?.map((r, i) => (
                  <li key={i} className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">• {r}</li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-5 rounded-2xl">
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-forest-600" /> Action Steps
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {decisionData.actionPoints?.map((a, i) => (
                  <li key={i} className="bg-forest-50/60 p-2 rounded-lg border border-forest-100">{i + 1}. {a}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Risk Factors */}
          {decisionData.riskFactors?.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Risk Factors
              </div>
              <ul className="list-disc list-inside space-y-0.5">
                {decisionData.riskFactors.map((rf, i) => <li key={i}>{rf}</li>)}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-100 text-slate-500 text-xs flex items-start gap-2">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <p>{decisionData.disclaimer}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
