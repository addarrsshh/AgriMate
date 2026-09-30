import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Droplet, 
  Clock, 
  ShieldAlert, 
  Leaf, 
  FlaskConical, 
  Calendar,
  CheckCircle,
  HelpCircle,
  Search,
  Filter
} from 'lucide-react';
import { api } from '../services/api';

export default function CropGuideView({ selectedCropId }) {
  const [crops, setCrops] = useState([]);
  const [activeCrop, setActiveCrop] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCrops = async () => {
      setLoading(true);
      try {
        const res = await api.getCrops();
        if (res.success && res.data) {
          setCrops(res.data);
          if (selectedCropId) {
            const found = res.data.find(c => c.id === selectedCropId);
            setActiveCrop(found || res.data[0]);
          } else {
            setActiveCrop(res.data[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCrops();
  }, [selectedCropId]);

  const filteredCrops = crops.filter(c => {
    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.soilSuitability.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
          Comprehensive Crop Cultivation & Agronomy Guide
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Explore stage-by-stage growth timelines, critical irrigation milestones, NPK requirements, and chemical vs. organic fertilizer schedules.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {['All', 'Cereal', 'Pulse', 'Oilseed', 'Vegetable', 'CashCrop'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-forest-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-forest-100 hover:text-forest-800'
              }`}
            >
              {cat === 'CashCrop' ? 'Cash Crop' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search crop or soil..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
        </div>
      </div>

      {/* 2-Column Layout: Sidebar of crops & Detailed Crop View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Crop List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {filteredCrops.map((crop) => {
            const isSelected = activeCrop?.id === crop.id;
            return (
              <div
                key={crop.id}
                onClick={() => setActiveCrop(crop)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-forest-50 border-forest-500 shadow-sm ring-1 ring-forest-500'
                    : 'glass-card hover:border-forest-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{crop.name}</h3>
                    <p className="text-xs text-slate-500 italic mt-0.5">{crop.scientificName}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                    {crop.category}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-600">
                  <span>Seasons: <strong>{crop.suitableSeasons.join(', ')}</strong></span>
                  <span>•</span>
                  <span>Duration: <strong>{crop.durationDays?.min}-{crop.durationDays?.max}d</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Agronomy Sheet (8 Cols) */}
        <div className="lg:col-span-8">
          {activeCrop ? (
            <div className="glass-card p-6 rounded-2xl space-y-6">
              {/* Header Box */}
              <div className="border-b border-slate-100 pb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-forest-100 text-forest-800 text-xs font-semibold mb-2">
                    <Sprout className="w-3.5 h-3.5" />
                    <span>{activeCrop.category} Cultivation Profile</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 font-heading">{activeCrop.name}</h2>
                  <p className="text-xs text-slate-500 italic">{activeCrop.scientificName}</p>
                </div>

                {/* Quick Stats Pill Grid */}
                <div className="flex gap-2">
                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center min-w-[90px]">
                    <div className="text-xs text-slate-500">Avg. Yield</div>
                    <div className="text-sm font-bold text-forest-700">{activeCrop.averageYieldPerAcreKg} kg/ac</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center min-w-[90px]">
                    <div className="text-xs text-slate-500">Mandi Rate</div>
                    <div className="text-sm font-bold text-forest-700">₹{activeCrop.currentModalPricePerQuintal}/qtl</div>
                  </div>
                </div>
              </div>

              {/* Biological Specs Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-forest-50/50 border border-forest-100">
                  <span className="text-slate-500 block">Sowing Season</span>
                  <strong className="text-slate-900 text-sm mt-0.5 block">{activeCrop.suitableSeasons.join(', ')}</strong>
                </div>
                <div className="p-3 rounded-xl bg-forest-50/50 border border-forest-100">
                  <span className="text-slate-500 block">Ideal Soils</span>
                  <strong className="text-slate-900 text-sm mt-0.5 block">{activeCrop.soilSuitability.join(', ')}</strong>
                </div>
                <div className="p-3 rounded-xl bg-forest-50/50 border border-forest-100">
                  <span className="text-slate-500 block">Water Level</span>
                  <strong className="text-slate-900 text-sm mt-0.5 block">{activeCrop.waterRequirementLevel} ({activeCrop.waterRequirement?.split(' ')[0]})</strong>
                </div>
                <div className="p-3 rounded-xl bg-forest-50/50 border border-forest-100">
                  <span className="text-slate-500 block">Storage Window</span>
                  <strong className="text-slate-900 text-sm mt-0.5 block">{activeCrop.shelfLifeDays} Days</strong>
                </div>
              </div>

              {/* Stage by Stage Cultivation Timeline */}
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-forest-600" />
                  <span>Growth Stages & Irrigation Milestones</span>
                </h3>
                <div className="space-y-3">
                  {activeCrop.stages?.map((stage, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-100 hover:border-forest-200 transition-colors">
                      <div className="flex items-center justify-between text-xs font-bold text-forest-900">
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center text-xs">
                            {idx + 1}
                          </span>
                          {stage.name}
                        </span>
                        <span className="text-slate-500 font-medium">{stage.daysAfterSowing}</span>
                      </div>
                      <div className="mt-2 text-xs text-slate-600 space-y-1 pl-7">
                        <div>💧 <strong>Water / Irrigation:</strong> {stage.waterNeeded}</div>
                        <div>🌱 <strong>Agronomic Action:</strong> {stage.action}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fertilization Guidance: Conventional vs. Organic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Conventional Plan */}
                <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 space-y-2">
                  <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
                    <FlaskConical className="w-4 h-4 text-sky-600" />
                    <span>Conventional Chemical Plan</span>
                  </div>
                  <div className="text-xs font-semibold text-sky-800">
                    Target NPK: {activeCrop.fertilizerRecommendation?.npkRatioKgPerAcre?.n} : {activeCrop.fertilizerRecommendation?.npkRatioKgPerAcre?.p} : {activeCrop.fertilizerRecommendation?.npkRatioKgPerAcre?.k} kg/ac
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeCrop.fertilizerRecommendation?.conventionalPlan}
                  </p>
                </div>

                {/* Organic Plan */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>Organic & Bio-fertilizer Plan</span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-800">
                    Soil Health & Microbial Inoculants
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeCrop.fertilizerRecommendation?.organicPlan}
                  </p>
                </div>
              </div>

              {/* Pest & Disease Management */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Integrated Pest & Disease Management (IPM)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeCrop.pestManagement}
                </p>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 rounded-2xl text-center text-slate-500">
              Select a crop from the list to view its complete agronomy guide.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
