import React, { useState, useEffect } from 'react';
import {
  Store,
  MapPin,
  TrendingUp,
  ArrowUpRight,
  Truck,
  CheckCircle,
  DollarSign,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function MarketPricesView({ onNavigateToAnalysis }) {
  const [priceData, setPriceData] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadMarketData = async () => {
      setLoading(true);
      try {
        const [pricesRes, marketsRes] = await Promise.all([
          api.getCurrentPrices(),
          api.getMarkets()
        ]);
        if (pricesRes.success && pricesRes.data) {
          setPriceData(pricesRes.data);
          setSelectedCrop(pricesRes.data[0]);
        }
        if (marketsRes.success && marketsRes.data) {
          setMarkets(marketsRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMarketData();
  }, []);

  const filteredPrices = priceData.filter(item =>
    item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
          Real-Time Mandi Prices & Market Comparison
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Compare live modal rates across regional APMC yards, calculate transport net returns, and discover highest-paying markets.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Mandis Tracked</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{markets.length} APMC Yards</div>
          <p className="text-xs text-slate-500 mt-1">Kozhikode, Malappuram, Wayanad, Kannur, Thrissur, Palakkad</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nearest Market</span>
          <div className="text-3xl font-extrabold text-forest-700 mt-2">Kozhikode APMC</div>
          <p className="text-xs text-slate-500 mt-1">6 km away • Avg daily volume: 420 Tons</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Price Spread Advantage</span>
          <div className="text-3xl font-extrabold text-harvest-600 mt-2">+₹420/qtl</div>
          <p className="text-xs text-slate-500 mt-1">Max inter-mandi arbitrage spread detected</p>
        </div>
      </div>

      {/* Main Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Commodities Table (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-heading">Commodity Rates Board</h2>
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter crop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="pb-3">Crop</th>
                  <th className="pb-3 text-right">Modal Rate</th>
                  <th className="pb-3 text-right">Best Market</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPrices.map((item) => {
                  const isSelected = selectedCrop?.cropId === item.cropId;
                  return (
                    <tr
                      key={item.cropId}
                      onClick={() => setSelectedCrop(item)}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-forest-50/80 font-medium' : 'hover:bg-slate-50/60'
                        }`}
                    >
                      <td className="py-3">
                        <div className="font-semibold text-slate-900">{item.cropName}</div>
                        <div className="text-xs text-slate-500">{item.category}</div>
                      </td>
                      <td className="py-3 text-right">
                        <div className="font-bold text-forest-700">₹{item.overallModalPrice.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">per quintal</div>
                      </td>
                      <td className="py-3 text-right">
                        <div className="text-xs font-bold text-slate-900">
                          {item.highestPayingMarket?.marketName?.split(' ')[0]}
                        </div>
                        <div className="text-xs text-emerald-600 font-semibold">
                          ₹{item.highestPayingMarket?.modalPrice?.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToAnalysis(item.cropId);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-forest-600 hover:text-white text-slate-700 text-xs font-medium transition-colors"
                        >
                          Trends →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Mandi Rates Breakdown for Selected Crop (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedCrop ? (
            <div className="glass-card p-6 rounded-2xl space-y-5">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">Inter-Mandi Comparison</span>
                  <h3 className="text-xl font-extrabold text-slate-900 font-heading">{selectedCrop.cropName}</h3>
                </div>
                <button
                  onClick={() => onNavigateToAnalysis(selectedCrop.cropId)}
                  className="px-3 py-1.5 rounded-xl bg-forest-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-forest-700 shadow-sm"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>30-Day Analysis</span>
                </button>
              </div>

              {/* Mandi Cards List */}
              <div className="space-y-3">
                {selectedCrop.mandiRates?.map((mandi, idx) => {
                  const isBest = idx === 0;
                  const estimatedTransport = Math.round((mandi.distanceKm / 50) * 35);
                  const netRealization = mandi.modalPrice - estimatedTransport;

                  return (
                    <div
                      key={mandi.marketId}
                      className={`p-3.5 rounded-xl border transition-all ${isBest
                          ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
                          : 'bg-white border-slate-100'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{mandi.marketName}</span>
                            {isBest && (
                              <span className="px-2 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                                Highest Rate
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{mandi.state} • {mandi.distanceKm} km away</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-extrabold text-forest-800">₹{mandi.modalPrice}</div>
                          <div className="text-[10px] text-slate-400">Min: ₹{mandi.minPrice} | Max: ₹{mandi.maxPrice}</div>
                        </div>
                      </div>

                      {/* Net Transport Math */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-600">
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Truck className="w-3 h-3" /> Est. Freight: ₹{estimatedTransport}/qtl
                        </span>
                        <span className="font-semibold text-slate-800">
                          Net: <strong className="text-forest-700">₹{netRealization}/qtl</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 rounded-2xl text-center text-slate-500">
              Select a commodity to view rates across mandis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
