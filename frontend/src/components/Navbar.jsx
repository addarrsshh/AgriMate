import React from 'react';
import {
  Sprout,
  TrendingUp,
  CloudSun,
  Calculator,
  Bot,
  Layers,
  ShieldAlert,
  Store,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendStatus }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recommendation', label: 'Crop Recommendation', icon: Sprout },
    { id: 'crops', label: 'Crop Guide', icon: Layers },
    { id: 'markets', label: 'Market Prices', icon: Store },
    { id: 'analysis', label: 'Price Analysis', icon: TrendingUp },
    { id: 'decision', label: 'Sell / Hold / Monitor', icon: ShieldAlert },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'profit', label: 'Profit Estimator', icon: Calculator },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-forest-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-forest-700 to-forest-500 flex items-center justify-center text-white shadow-md shadow-forest-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-forest-900 font-heading">
                Agri<span className="text-harvest-600">Mate</span>
              </span>

            </div>
          </div>

          {/* Backend Health Status Pill */}
          <div className="flex items-center gap-3">
            <div className={`hidden md:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${backendStatus === 'connected'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
              {backendStatus === 'connected' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>API Connected</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Connecting to API...</span>
                </>
              )}
            </div>

            <div className="text-xs bg-forest-50 text-forest-800 border border-forest-200 px-3 py-1 rounded-lg font-medium">
              📍 Kozhikode, Kerala
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Bar */}
        <div className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${isActive
                  ? 'bg-forest-600 text-white shadow-sm shadow-forest-600/25'
                  : 'text-slate-600 hover:text-forest-700 hover:bg-forest-50'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-forest-600'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
