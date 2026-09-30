import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer, 
  Sun, 
  CloudRain, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export default function WeatherView() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadWeather = async () => {
    setLoading(true);
    try {
      const res = await api.getWeather(11.248, 75.7804, 'Kozhikode, Kerala');
      if (res.success && res.data) {
        setWeather(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            Agro-Meteorological Forecast & Advisories
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time localized weather data, 7-day precipitation risk, and pesticide spraying suitability windows.
          </p>
        </div>

        <button
          onClick={loadWeather}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-forest-50 flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Forecast</span>
        </button>
      </div>

      {loading ? (
        <div className="glass-card p-12 rounded-2xl text-center text-slate-500">
          Loading weather radar and agricultural advisories...
        </div>
      ) : weather ? (
        <div className="space-y-6">
          {/* Hero Weather Card */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white via-sky-50/30 to-emerald-50/20 border border-sky-100">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-forest-700 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{weather.location}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading">
                  {weather.current?.tempCelsius}°C
                </h2>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  {weather.current?.condition}
                </p>
              </div>

              {/* Source Tag */}
              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
                  {weather.source}
                </span>
                <div className="text-[11px] text-slate-400 mt-1">
                  Updated: {new Date(weather.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Relative Humidity</span>
                  <strong className="text-sm font-bold text-slate-900">{weather.current?.humidityPct}%</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-100 text-teal-700">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Wind Velocity</span>
                  <strong className="text-sm font-bold text-slate-900">{weather.current?.windSpeedKmh} km/h</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                  <CloudRain className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Rainfall Chance</span>
                  <strong className="text-sm font-bold text-slate-900">{weather.current?.rainfallChancePct}%</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Soil Temperature</span>
                  <strong className="text-sm font-bold text-slate-900">{weather.current?.soilTempCelsius}°C</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Row */}
          <div>
            <h3 className="font-bold text-slate-900 text-base font-heading mb-3">7-Day Agro Forecast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast7Day?.map((day, idx) => {
                const isRain = day.rainMm > 0;
                return (
                  <div key={idx} className="glass-card p-3.5 rounded-xl text-center space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">{day.day}</span>
                    <div className="my-1 text-slate-600 flex justify-center">
                      {isRain ? <CloudRain className="w-6 h-6 text-blue-500" /> : <Sun className="w-6 h-6 text-amber-500" />}
                    </div>
                    <div className="text-xs font-extrabold text-slate-900">
                      {day.tempMax}° / <span className="text-slate-500 font-normal">{day.tempMin}°</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Rain: {day.rainMm} mm
                    </div>
                    <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      day.sprayRisk.startsWith('High') 
                        ? 'bg-rose-100 text-rose-800' 
                        : day.sprayRisk.startsWith('Moderate') 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {day.sprayRisk.split(' ')[0]} Spray Risk
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Targeted Agro-Advisories */}
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <h3 className="font-bold text-slate-900 text-base font-heading flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-forest-600" />
              <span>Weather-Triggered Field Advisories</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weather.agroAdvisories?.map((adv, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-forest-50/60 border border-forest-100 text-xs">
                  <strong className="text-forest-900 font-bold block mb-1">
                    🏷️ {adv.category}
                  </strong>
                  <p className="text-slate-700 leading-relaxed">
                    {adv.advice}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
