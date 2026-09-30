import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  DollarSign, 
  Calendar, 
  Droplet,
  SlidersHorizontal,
  Layers,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function CropRecommendationView({ onSelectCrop }) {
  const [formData, setFormData] = useState({
    soilType: 'Alluvial',
    season: 'Rabi',
    waterAvailability: 'Medium',
    landSizeAcres: 3,
    district: 'Kozhikode, Kerala'
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getRecommendations(formData);
      if (response.success && response.data) {
        setResults(response.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecommendations();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
          Smart Crop Suitability & Recommendation Engine
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Calculate multi-factor suitability based on soil type, seasonal calendar, irrigation capacity, and projected profitability.
        </p>
      </div>

      {/* Input Parameters Card */}
      <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4 text-forest-900 font-bold text-base">
          <SlidersHorizontal className="w-5 h-5 text-forest-600" />
          <span>Farm Profile Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Soil Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Soil Type
            </label>
            <select
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
            >
              <option value="Alluvial">Alluvial Soil</option>
              <option value="Loamy">Loamy Soil</option>
              <option value="Clayey">Clayey Soil</option>
              <option value="Black">Black Cotton Soil</option>
              <option value="Sandy Loam">Sandy Loam</option>
              <option value="Red">Red Soil</option>
            </select>
          </div>

          {/* Season */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Current / Target Season
            </label>
            <select
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
            >
              <option value="Rabi">Rabi (Winter: Oct - Mar)</option>
              <option value="Kharif">Kharif (Monsoon: Jun - Oct)</option>
              <option value="Zaid">Zaid (Summer: Mar - Jun)</option>
            </select>
          </div>

          {/* Water Availability */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Irrigation Capacity
            </label>
            <select
              value={formData.waterAvailability}
              onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
            >
              <option value="High">High (Canal / Reliable Tubewell)</option>
              <option value="Medium">Medium (Semi-reliable / Drip)</option>
              <option value="Low">Low (Rainfed / Scanty)</option>
            </select>
          </div>

          {/* Land Size */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Land Area (Acres)
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={formData.landSizeAcres}
              onChange={(e) => setFormData({ ...formData, landSizeAcres: parseFloat(e.target.value) || 1 })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-sm transition-all shadow-md shadow-forest-600/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-harvest-300" />
            <span>{loading ? 'Calculating Suitability...' : 'Run Suitability Matcher'}</span>
          </button>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Recommendation Results List */}
      {results && results.recommendations && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Ranked Crop Matches for {formData.landSizeAcres} Acres ({formData.soilType} Soil, {formData.season} Season)
            </h2>
            <span className="text-xs font-medium text-slate-500">
              Deterministic Suitability Algorithm
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.recommendations.map((rec, index) => {
              const isTop = index === 0;
              return (
                <div
                  key={rec.cropId}
                  className={`glass-card p-5 rounded-2xl relative flex flex-col justify-between transition-all ${
                    isTop ? 'ring-2 ring-forest-500 shadow-lg' : ''
                  }`}
                >
                  {isTop && (
                    <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-forest-600 text-white text-xs font-bold shadow-sm">
                      ★ Top Recommendation
                    </div>
                  )}

                  <div>
                    {/* Header: Name and Score */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{rec.cropName}</h3>
                        <span className="inline-block mt-0.5 text-xs font-medium text-slate-500">
                          {rec.category} • {rec.durationDays?.min}-{rec.durationDays?.max} days
                        </span>
                      </div>
                      
                      {/* Score Badge */}
                      <div className={`px-2.5 py-1 rounded-xl text-sm font-extrabold flex items-center gap-1 ${
                        rec.score >= 80 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : rec.score >= 60 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        <span>{rec.score}%</span>
                      </div>
                    </div>

                    {/* Suitability Score Meters */}
                    <div className="mt-4 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Soil Compatibility</span>
                        <span className="font-semibold">{rec.breakdown?.soilScore}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-forest-500 h-full rounded-full" style={{ width: `${rec.breakdown?.soilScore}%` }}></div>
                      </div>

                      <div className="flex justify-between text-slate-600 pt-1">
                        <span>Season Alignment</span>
                        <span className="font-semibold">{rec.breakdown?.seasonScore}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-forest-500 h-full rounded-full" style={{ width: `${rec.breakdown?.seasonScore}%` }}></div>
                      </div>
                    </div>

                    {/* Financial Estimations Box */}
                    <div className="mt-4 p-3 rounded-xl bg-forest-50/60 border border-forest-100 space-y-1">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Est. Net Profit/Acre:</span>
                        <span className="font-bold text-forest-800">₹{rec.estimatedNetProfitPerAcre.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Total ({formData.landSizeAcres} ac):</span>
                        <span className="font-extrabold text-forest-900">₹{rec.totalProjectedProfit.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Reasons and Risks */}
                    <div className="mt-3 space-y-1">
                      {rec.reasons?.slice(0, 2).map((r, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </div>
                      ))}
                      {rec.risks?.map((rk, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-rose-600 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span>{rk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => onSelectCrop(rec.cropId)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-forest-100 hover:text-forest-800 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>View Cultivation & Fertilizer Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
