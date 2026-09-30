const https = require('https');
const { defaultWeather } = require('../data/mockSeedData');

// In-memory 30-minute cache
const weatherCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000;

const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
          return reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 100)}`));
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse weather API response: ${e.message}`));
        }
      });
    }).on('error', err => reject(err));
  });
};

const mapWmoToCondition = (code) => {
  if (code === 0) return 'Sunny / Clear';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 56 && code <= 57) return 'Freezing Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Clear';
};

const calculateSprayRisk = (rainMm = 0, windSpeedKmh = 0) => {
  if (rainMm > 5 || windSpeedKmh > 20) return 'High (Avoid spraying pesticides)';
  if (rainMm > 1 || windSpeedKmh > 12) return 'Moderate (Check wind speed)';
  return 'Low (Safe to spray)';
};

const getDayLabel = (index, dateStr) => {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return `Day ${index + 1}`;
  }
};

const getWeatherData = async (lat = 11.248, lng = 75.7804, locationName = "Kozhikode, Kerala") => {
  const cacheKey = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  const envKey = (process.env.WEATHER_API_KEY || '').trim();

  // If a valid 32-character hex key (OpenWeatherMap) is provided and not a URL or open-meteo, use OpenWeatherMap
  const isOpenWeatherMapKey = /^[a-f0-9]{32}$/i.test(envKey);

  if (isOpenWeatherMapKey) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${envKey}`;
      const raw = await fetchJson(url);

      if (raw && raw.main) {
        const condition = raw.weather && raw.weather[0] ? raw.weather[0].main : "Clear";
        const tempCelsius = Math.round(raw.main.temp);
        const humidityPct = raw.main.humidity;
        const windSpeedKmh = Math.round((raw.wind?.speed || 2) * 3.6);

        const liveData = {
          location: `${raw.name || locationName}, ${raw.sys?.country || "IN"}`,
          coordinates: { lat, lng },
          current: {
            tempCelsius,
            condition,
            humidityPct,
            windSpeedKmh,
            rainfallChancePct: condition.toLowerCase().includes('rain') ? 85 : 10,
            uvIndex: 5,
            soilTempCelsius: tempCelsius - 3,
            evapotranspirationMm: 3.5
          },
          forecast7Day: defaultWeather.forecast7Day,
          agroAdvisories: defaultWeather.agroAdvisories,
          source: "OpenWeatherMap Live API",
          lastUpdated: new Date().toISOString()
        };

        weatherCache.set(cacheKey, { timestamp: Date.now(), data: liveData });
        return liveData;
      }
    } catch (err) {
      console.warn(`[Weather] OpenWeatherMap fetch failed (${err.message}). Falling back to Open-Meteo.`);
    }
  }

  // Open-Meteo Integration (Free, No Key Required, High Precision Agri Metrics)
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,soil_temperature_0cm&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
    const raw = await fetchJson(url);

    if (raw && raw.current && raw.daily) {
      const tempCelsius = Math.round(raw.current.temperature_2m);
      const humidityPct = Math.round(raw.current.relative_humidity_2m);
      const windSpeedKmh = Math.round(raw.current.wind_speed_10m);
      const condition = mapWmoToCondition(raw.current.weather_code);
      const soilTempCelsius = Math.round(raw.current.soil_temperature_0cm ?? (tempCelsius - 2));
      const rainfallChancePct = raw.daily.precipitation_probability_max?.[0] ?? (raw.current.precipitation > 0 ? 80 : 10);

      // Build 7-day forecast from daily arrays
      const forecast7Day = (raw.daily.time || []).slice(0, 7).map((dateStr, idx) => {
        const dayRain = raw.daily.precipitation_sum?.[idx] || 0;
        const dayWind = raw.daily.wind_speed_10m_max?.[idx] || 10;
        const dayCode = raw.daily.weather_code?.[idx] ?? 0;
        return {
          day: getDayLabel(idx, dateStr),
          date: dateStr,
          tempMax: Math.round(raw.daily.temperature_2m_max?.[idx] ?? tempCelsius),
          tempMin: Math.round(raw.daily.temperature_2m_min?.[idx] ?? (tempCelsius - 8)),
          condition: mapWmoToCondition(dayCode),
          rainMm: Number(dayRain.toFixed(1)),
          sprayRisk: calculateSprayRisk(dayRain, dayWind)
        };
      });

      // Agro advisories tailored to live weather conditions
      const agroAdvisories = [
        ...(rainfallChancePct > 50
          ? [{
              category: "Precipitation Alert",
              advice: `High rain likelihood (${rainfallChancePct}%) in current cycle. Postpone chemical sprayings and prepare drainage channels.`
            }]
          : [{
              category: "Spraying Advisory",
              advice: windSpeedKmh < 15
                ? `Wind speed is calm (${windSpeedKmh} km/h). Good spraying window for foliar fertilizers and pest control.`
                : `Wind speed is elevated (${windSpeedKmh} km/h). Beware of spray drift on nearby crops.`
            }]),
        {
          category: "Soil & Irrigation",
          advice: `Topsoil temperature is ${soilTempCelsius}°C with ${humidityPct}% relative humidity. ${soilTempCelsius > 25 ? 'High soil evaporation; schedule early morning irrigation.' : 'Optimal soil temperature for root absorption and fertilizer uptake.'}`
        },
        ...defaultWeather.agroAdvisories.slice(0, 1)
      ];

      const liveData = {
        location: locationName,
        coordinates: { lat, lng },
        current: {
          tempCelsius,
          condition,
          humidityPct,
          windSpeedKmh,
          rainfallChancePct,
          uvIndex: 6,
          soilTempCelsius,
          evapotranspirationMm: 3.6
        },
        forecast7Day,
        agroAdvisories,
        source: "Open-Meteo Live Agro-Weather API",
        lastUpdated: new Date().toISOString()
      };

      weatherCache.set(cacheKey, { timestamp: Date.now(), data: liveData });
      return liveData;
    }

    throw new Error("Invalid response structure from Open-Meteo");
  } catch (error) {
    console.warn(`[Weather] Live API fetch failed (${error.message}). Returning development weather data.`);
    const fallbackData = {
      ...defaultWeather,
      location: locationName || defaultWeather.location,
      source: "Development Agro-Weather Fallback",
      notice: `Live API call failed: ${error.message}`,
      lastUpdated: new Date().toISOString()
    };
    weatherCache.set(cacheKey, { timestamp: Date.now(), data: fallbackData });
    return fallbackData;
  }
};

module.exports = {
  getWeatherData
};
