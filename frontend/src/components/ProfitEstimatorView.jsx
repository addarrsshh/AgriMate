import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function ProfitEstimatorView() {
  const [crops, setCrops] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState('crop-wheat');
  const [inputs, setInputs] = useState({
    acreage: 2,
    customYieldKgPerAcre: 1800,
    customPricePerQuintal: 2450,
    seedCost: 2300,
    fertilizerCost: 3800,
    laborCost: 4600,
    irrigationCost: 1800,
    machineryCost: 1500,
    transportCostPerQuintal: 35,
    otherCost: 1200
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getCrops().then(res => {
      if (res.success && res.data) {
        setCrops(res.data);
        const def = res.data.find(c => c.id === 'crop-wheat') || res.data[0];
        if (def) {
          setSelectedCropId(def.id);
          setInputs(prev => ({ ...prev, customYieldKgPerAcre: def.averageYieldPerAcreKg, customPricePerQuintal: def.currentModalPricePerQuintal }));
        }
      }
    }).catch(() => {});
  }, []);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await api.calculateProfit({ cropId: selectedCropId, ...inputs });
      if (res.success && res.data) setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { calculate(); }, [selectedCropId, inputs]);

  const handleCropChange = (id) => {
    setSelectedCropId(id);
    const crop = crops.find(c => c.id === id);
    if (crop) setInputs(prev => ({ ...prev, customYieldKgPerAcre: crop.averageYieldPerAcreKg, customPricePerQuintal: crop.currentModalPricePerQuintal }));
  };

  const field = (label, key, opts = {}) => (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <input type="number" value={inputs[key]} {...opts}
        onChange={e => setInputs({ ...inputs, [key]: parseFloat(e.target.value) || 0 })}
        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500" />
    </div>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-slate-900">Profit Estimator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-forest-600" /> Inputs
            </h2>
            <button onClick={calculate} className="text-xs text-forest-700 font-semibold flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Recalculate
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Crop</label>
            <select value={selectedCropId} onChange={e => handleCropChange(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500">
              {crops.map(c => <option key={c.id} value={c.id}>{c.name} ({c.category})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {field('Land Size (Acres)', 'acreage', { min: 0.5, step: 0.5 })}
            {field('Yield (kg/Acre)', 'customYieldKgPerAcre')}
            <div className="col-span-2">{field('Selling Rate (₹/Quintal)', 'customPricePerQuintal')}</div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Expenses (₹)</span>
            <div className="grid grid-cols-2 gap-3">
              {field('Seeds', 'seedCost')}
              {field('Fertilizers', 'fertilizerCost')}
              {field('Labor', 'laborCost')}
              {field('Irrigation', 'irrigationCost')}
              {field('Machinery', 'machineryCost')}
              {field('Freight/Qtl', 'transportCostPerQuintal')}
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="glass-card p-5 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-forest-600" /> Results ({result.acreage} Acres)
            </h2>

            <div className={`p-5 rounded-2xl text-white ${result.financialSummary?.isProfitable ? 'bg-forest-600' : 'bg-rose-600'}`}>
              <span className="text-xs font-semibold opacity-80 block">Net Profit</span>
              <div className="text-4xl font-black mt-1">₹{result.financialSummary?.netProfit.toLocaleString()}</div>
              <div className="mt-2 text-xs opacity-90 flex justify-between">
                <span>₹{result.financialSummary?.profitPerAcre.toLocaleString()} / Acre</span>
                <span className="font-bold bg-white/20 px-2 py-0.5 rounded-full">ROI: {result.financialSummary?.roiPercentage}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 block">Gross Revenue</span>
                <strong>₹{result.financialSummary?.grossRevenue.toLocaleString()}</strong>
                <span className="text-xs text-slate-400 block">{result.productionMetrics?.totalYieldQuintals} qtl</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 block">Total Expenses</span>
                <strong>₹{result.financialSummary?.totalExpenses.toLocaleString()}</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-between text-sm">
              <div>
                <span className="text-xs font-bold text-forest-900 block">Break-Even Price</span>
                <span className="text-xs text-slate-500">Minimum to cover costs</span>
              </div>
              <strong className="text-xl font-extrabold text-forest-800">₹{result.pricingMetrics?.breakEvenPricePerQuintal}<span className="text-xs font-normal text-slate-500">/qtl</span></strong>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
              <span className="font-bold text-slate-700 block mb-2">Cost Breakdown</span>
              {[
                ['Seeds', result.costBreakdown?.seedExpense],
                ['Fertilizers', result.costBreakdown?.fertilizerExpense],
                ['Labor', result.costBreakdown?.laborExpense],
                ['Machinery', result.costBreakdown?.machineryExpense],
                ['Transport', result.costBreakdown?.transportExpense],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between">
                  <span>{l}</span><strong>₹{v?.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
