// Frontend API Service communicating with Express Backend

const API_BASE = '/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error?.message || `HTTP error ${response.status}`);
  }
  return response.json();
};

export const api = {
  // Health
  checkHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },

  // Crops
  getCrops: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/crops${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },

  getCropDetail: async (id) => {
    const res = await fetch(`${API_BASE}/crops/${id}`);
    return handleResponse(res);
  },

  getRecommendations: async (farmerProfile) => {
    const res = await fetch(`${API_BASE}/crops/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmerProfile)
    });
    return handleResponse(res);
  },

  getFertilizers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/crops/fertilizers${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },

  // Markets & Prices
  getMarkets: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/markets${query ? `?${query}` : ''}`);
    return handleResponse(res);
  },

  getCurrentPrices: async () => {
    const res = await fetch(`${API_BASE}/markets/prices/current`);
    return handleResponse(res);
  },

  getPriceHistory: async (cropId) => {
    const res = await fetch(`${API_BASE}/markets/prices/${cropId}/history`);
    return handleResponse(res);
  },

  getPriceAnalysis: async (cropId) => {
    const res = await fetch(`${API_BASE}/markets/prices/${cropId}/analysis`);
    return handleResponse(res);
  },

  // Sell / Hold / Monitor Decision Support
  getSellHoldDecision: async (params) => {
    const res = await fetch(`${API_BASE}/decisions/sell-hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return handleResponse(res);
  },

  // Weather
  getWeather: async (lat, lng, location) => {
    const params = new URLSearchParams();
    if (lat) params.append('lat', lat);
    if (lng) params.append('lng', lng);
    if (location) params.append('location', location);
    const res = await fetch(`${API_BASE}/weather?${params.toString()}`);
    return handleResponse(res);
  },

  // Profit Estimator
  calculateProfit: async (inputs) => {
    const res = await fetch(`${API_BASE}/profit/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    });
    return handleResponse(res);
  },

  // AI Assistant
  askAssistant: async (question, context = {}) => {
    const res = await fetch(`${API_BASE}/ai/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context })
    });
    return handleResponse(res);
  }
};
