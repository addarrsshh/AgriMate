import React, { useState } from 'react';
import {
  Sprout,
  CloudSun,
  ShieldAlert,
  ArrowUpRight,
  Droplets,
  Store,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

export default function DashboardView({ onNavigate, weatherData, priceData, cropsData }) {
  const currentTemp = weatherData?.current?.tempCelsius ?? 24;
  const weatherCond = weatherData?.current?.condition ?? "Partly Cloudy";
  const rainChance = weatherData?.current?.rainfallChancePct ?? 15;

  const [selectedCropId, setSelectedCropId] = useState('');

  const selectedCropPrice = priceData?.find(p => p.cropId === selectedCropId);

  return (
    <div className="space-y-6">
      {/* Crop Price Lookup */}
      <div className="glass-card p-5 rounded-2xl">
        <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Sprout className="w-4 h-4 text-forest-600" />
          Crop Price Lookup
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <select
              value={selectedCropId}
              onChange={e => setSelectedCropId(e.target.value)}
              className="w-full appearance-none px-3 py-2 pr-8 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
            >
              <option value="">— Select a crop —</option>
              {cropsData?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {selectedCropPrice ? (
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <span className="text-xs text-slate-500 block">Highest Price</span>
                <span className="text-2xl font-extrabold text-forest-700">
                  ₹{selectedCropPrice.highestPayingMarket?.modalPrice?.toLocaleString()}
                  <span className="text-sm font-normal text-slate-500">/qtl</span>
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Best Market</span>
                <span className="text-base font-semibold text-slate-800">
                  {selectedCropPrice.highestPayingMarket?.marketName}
                </span>
              </div>
              <button
                onClick={() => onNavigate('markets')}
                className="text-xs text-forest-700 font-semibold flex items-center gap-0.5 hover:underline"
              >
                All markets <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : selectedCropId ? (
            <span className="text-sm text-slate-500">No price data available.</span>
          ) : null}
        </div>
      </div>

      {/* 3-Card Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Weather Card */}
        <div onClick={() => onNavigate('weather')} className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Agro-Weather</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600"><CloudSun className="w-5 h-5" /></div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{currentTemp}°C</div>
            <div className="text-sm font-medium text-slate-600">{weatherCond}</div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-sky-500" /> Rain: {rainChance}%</span>
            <span className="text-forest-700 font-medium flex items-center gap-0.5">View <ArrowUpRight className="w-3 h-3" /></span>
          </div>
        </div>

        {/* Market Signal Card */}
        <div onClick={() => onNavigate('markets')} className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Market Prices</span>
            <div className="p-2 rounded-xl bg-forest-50 text-forest-600"><Store className="w-5 h-5" /></div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-forest-700">
              ₹{priceData?.[0]?.overallModalPrice?.toLocaleString() ?? '—'}
              <span className="text-sm font-normal text-slate-500">/qtl</span>
            </div>
            <div className="text-sm font-medium text-slate-600">{priceData?.[0]?.cropName ?? 'Live rates'}</div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{priceData?.length ?? 0} crops tracked</span>
            <span className="text-forest-700 font-medium flex items-center gap-0.5">View <ArrowUpRight className="w-3 h-3" /></span>
          </div>
        </div>

        {/* Sell/Hold Signal Card */}
        <div onClick={() => onNavigate('decision')} className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Market Signal</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600"><ShieldAlert className="w-5 h-5" /></div>
          </div>
          <div className="mt-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-bold">
              HOLD: Basmati Paddy
            </div>
            <div className="text-xs text-slate-600 mt-2">Momentum +3.5% over 7 days</div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Confidence: 84%</span>
            <span className="text-forest-700 font-medium flex items-center gap-0.5">Check <ArrowUpRight className="w-3 h-3" /></span>
          </div>
        </div>
      </div>

      {/* Agro Advisory */}
      {weatherData?.agroAdvisories?.[0] && (
        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-harvest-500">
          <div className="flex items-center gap-2 text-harvest-800 font-bold text-sm mb-2">
            <AlertTriangle className="w-4 h-4 text-harvest-600" />
            <span>Agro Advisory — {weatherData.agroAdvisories[0].category}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{weatherData.agroAdvisories[0].advice}</p>
          <button onClick={() => onNavigate('weather')} className="mt-3 text-xs text-forest-700 font-semibold">
            Full Forecast →
          </button>
        </div>
      )}

      {/* AI Assistant Shortcut */}
      <div className="glass-card p-5 rounded-2xl bg-gradient-to-br from-forest-50/70 to-emerald-50/40 border border-emerald-100">
        <div className="flex items-center gap-2 text-forest-900 font-bold text-sm mb-2">
          <Sparkles className="w-4 h-4 text-forest-600" />
          <span>Ask AI Farming Assistant</span>
        </div>
        <button
          onClick={() => onNavigate('assistant')}
          className="mt-1 w-full py-2.5 px-4 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2"
        >
          Open AI Assistant <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
