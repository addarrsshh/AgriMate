import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import CropRecommendationView from './components/CropRecommendationView';
import CropGuideView from './components/CropGuideView';
import MarketPricesView from './components/MarketPricesView';
import PriceAnalysisView from './components/PriceAnalysisView';
import SellHoldDecisionView from './components/SellHoldDecisionView';
import WeatherView from './components/WeatherView';
import ProfitEstimatorView from './components/ProfitEstimatorView';
import AiAssistantView from './components/AiAssistantView';
import { api } from './services/api';
import { Sprout } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [weatherData, setWeatherData] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [cropsData, setCropsData] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState('crop-wheat');

  useEffect(() => {
    // Initial health and baseline data load
    const initApp = async () => {
      try {
        const health = await api.checkHealth();
        if (health.status === 'healthy') {
          setBackendStatus('connected');
        }
      } catch (err) {
        console.warn('Backend connection notice:', err.message);
        setBackendStatus('offline');
      }

      // Pre-fetch lightweight dashboard feeds
      try {
        const [wRes, pRes, cRes] = await Promise.all([
          api.getWeather(11.248, 75.7804, 'Kozhikode, Kerala').catch(() => null),
          api.getCurrentPrices().catch(() => null),
          api.getCrops().catch(() => null)
        ]);

        if (wRes && wRes.success) setWeatherData(wRes.data);
        if (pRes && pRes.success) setPriceData(pRes.data);
        if (cRes && cRes.success) setCropsData(cRes.data);
      } catch (e) {
        console.warn('Initial data preload notice:', e.message);
      }
    };

    initApp();
  }, []);

  // Cross-component navigations
  const handleSelectCropForGuide = (cropId) => {
    setSelectedCropId(cropId);
    setActiveTab('crops');
  };

  const handleNavigateToAnalysis = (cropId) => {
    setSelectedCropId(cropId);
    setActiveTab('analysis');
  };

  const handleNavigateToDecision = (cropId) => {
    setSelectedCropId(cropId);
    setActiveTab('decision');
  };

  return (
    <div className="min-h-screen flex flex-col bg-earth-50 text-slate-900">
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        backendStatus={backendStatus} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView 
            onNavigate={setActiveTab}
            weatherData={weatherData}
            priceData={priceData}
            cropsData={cropsData}
          />
        )}

        {activeTab === 'recommendation' && (
          <CropRecommendationView 
            onSelectCrop={handleSelectCropForGuide} 
          />
        )}

        {activeTab === 'crops' && (
          <CropGuideView 
            selectedCropId={selectedCropId} 
          />
        )}

        {activeTab === 'markets' && (
          <MarketPricesView 
            onNavigateToAnalysis={handleNavigateToAnalysis} 
          />
        )}

        {activeTab === 'analysis' && (
          <PriceAnalysisView 
            selectedCropId={selectedCropId}
            onNavigateToDecision={handleNavigateToDecision}
          />
        )}

        {activeTab === 'decision' && (
          <SellHoldDecisionView 
            selectedCropId={selectedCropId} 
          />
        )}

        {activeTab === 'weather' && (
          <WeatherView />
        )}

        {activeTab === 'profit' && (
          <ProfitEstimatorView />
        )}

        {activeTab === 'assistant' && (
          <AiAssistantView />
        )}
      </main>
    </div>
  );
}
