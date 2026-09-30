// Comprehensive API Verification Suite for AgriMate Backend
import http from 'http';
import app, { ensureDatabaseInitialized } from '../backend/dist/app.js';

const requestJson = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : null;

    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Connection': 'close',
        ...(postData ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) } : {}),
        ...options.headers
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          json: () => Promise.resolve(parsed),
          body: parsed
        });
      });
    });

    req.on('error', err => reject(err));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('🚀 Starting AgriMate TypeScript API Verification Suite...');
  await ensureDatabaseInitialized();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 5001;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`📡 Ephemeral Test Server running on ${baseUrl}\n`);

  let passed = 0;
  let failed = 0;

  const assert = (condition, description, details = '') => {
    if (condition) {
      console.log(`  ✅ [PASS] ${description}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${description} ${details}`);
      failed++;
    }
  };

  try {
    // 1. Health Check
    {
      const res = await requestJson(`${baseUrl}/api/health`);
      const body = res.body;
      assert(res.status === 200, 'GET /api/health returns 200');
      assert(body.status === 'healthy', 'GET /api/health body.status === healthy');
      assert(body.service === 'AgriMate REST API', 'GET /api/health body.service === AgriMate REST API');
      assert(typeof body.database?.connected === 'boolean', 'GET /api/health has database status');
    }

    // 2. Health Check via /health
    {
      const res = await requestJson(`${baseUrl}/health`);
      const body = res.body;
      assert(res.status === 200, 'GET /health returns 200');
      assert(body.status === 'healthy', 'GET /health body.status === healthy');
    }

    // 3. List Crops
    {
      const res = await requestJson(`${baseUrl}/api/crops`);
      const body = res.body;
      assert(res.status === 200, 'GET /api/crops returns 200');
      assert(body.success === true, 'GET /api/crops body.success === true');
      assert(Array.isArray(body.data) && body.data.length >= 10, 'GET /api/crops returns >= 10 crops');
    }

    // 4. Filter Crops by Season
    {
      const res = await requestJson(`${baseUrl}/api/crops?season=Rabi`);
      const body = res.body;
      assert(res.status === 200, 'GET /api/crops?season=Rabi returns 200');
      assert(body.data.every(c => c.suitableSeasons.includes('Rabi')), 'All returned crops have Rabi season');
    }

    // 5. Crop Detail
    {
      const res = await requestJson(`${baseUrl}/api/crops/crop-wheat`);
      const body = res.body;
      assert(res.status === 200, 'GET /api/crops/crop-wheat returns 200');
      assert(body.data?.name?.includes('Wheat'), 'Crop detail returns Wheat data');
      assert(body.data?.stages?.length > 0, 'Crop detail includes growth stages');
    }

    // 6. Crop Detail Not Found (404)
    {
      const res = await requestJson(`${baseUrl}/api/crops/crop-nonexistent`);
      const body = res.body;
      assert(res.status === 404, 'GET /api/crops/crop-nonexistent returns 404');
      assert(body.success === false, 'Crop 404 returns success === false');
    }

    // 7. Crop Recommendation (POST)
    {
      const res = await requestJson(`${baseUrl}/api/crops/recommend`, {
        method: 'POST',
        body: {
          soilType: 'Alluvial',
          season: 'Rabi',
          waterAvailability: 'Medium',
          landSizeAcres: 3
        }
      });
      const body = res.body;
      assert(res.status === 200, 'POST /api/crops/recommend returns 200');
      assert(body.data?.topRecommendation !== null, 'Recommendation contains topRecommendation');
      assert(body.data?.recommendations?.length > 0, 'Recommendation contains recommendations array');
      assert(typeof body.data?.topRecommendation?.score === 'number', 'Recommendation has numeric score');
    }

    // 8. Fertilizers
    {
      const res = await requestJson(`${baseUrl}/api/crops/fertilizers`);
      const body = res.body;
      assert(res.status === 200, 'GET /api/crops/fertilizers returns 200');
      assert(Array.isArray(body.data) && body.data.length >= 6, 'Fertilizers list returns >= 6 items');
    }

    // 9. Fertilizers Filter Organic
    {
      const res = await requestJson(`${baseUrl}/api/crops/fertilizers?organic=true`);
      const body = res.body;
      assert(res.status === 200, 'GET /api/crops/fertilizers?organic=true returns 200');
      assert(body.data.every(f => f.organic === true), 'All filtered fertilizers are organic');
    }

    // 10. Markets List
    {
      const res = await requestJson(`${baseUrl}/api/markets`);
      const body = res.body;
      assert(res.status === 200, 'GET /api/markets returns 200');
      assert(body.data?.length >= 6, 'Markets returns >= 6 mandis');
      assert(body.data.some(m => m.district === 'Kozhikode'), 'Includes Kozhikode mandi');
    }

    // 11. Current Market Prices Overview
    {
      const res = await requestJson(`${baseUrl}/api/markets/prices/current`);
      const body = res.body;
      assert(res.status === 200, 'GET /api/markets/prices/current returns 200');
      assert(Array.isArray(body.data) && body.data.length >= 10, 'Prices current returns price overview for all crops');
      assert(body.data[0].highestPayingMarket !== undefined, 'Includes highestPayingMarket calculation');
      assert(body.data[0].mandiRates?.length > 0, 'Includes mandi rates breakdown');
    }

    // 12. Price History
    {
      const res = await requestJson(`${baseUrl}/api/markets/prices/crop-wheat/history`);
      const body = res.body;
      assert(res.status === 200, 'GET /api/markets/prices/crop-wheat/history returns 200');
      assert(body.data?.length === 30, 'Price history returns 30 days of records');
      assert(body.cropId === 'crop-wheat', 'Price history has correct cropId');
    }

    // 13. Price Analysis
    {
      const res = await requestJson(`${baseUrl}/api/markets/prices/crop-wheat/analysis`);
      const body = res.body;
      assert(res.status === 200, 'GET /api/markets/prices/crop-wheat/analysis returns 200');
      assert(typeof body.data?.sma7 === 'number', 'Price analysis includes sma7');
      assert(typeof body.data?.sma30 === 'number', 'Price analysis includes sma30');
      assert(typeof body.data?.trend === 'string', 'Price analysis includes trend');
    }

    // 14. Sell / Hold Decision (Valid)
    {
      const res = await requestJson(`${baseUrl}/api/decisions/sell-hold`, {
        method: 'POST',
        body: { cropId: 'crop-wheat', storageDaysRemaining: 45 }
      });
      const body = res.body;
      assert(res.status === 200, 'POST /api/decisions/sell-hold returns 200');
      assert(['SELL', 'HOLD', 'MONITOR'].includes(body.data?.decision), 'Decision is one of SELL, HOLD, MONITOR');
      assert(typeof body.data?.confidenceScore === 'number', 'Decision includes confidenceScore');
      assert(body.data?.reasons?.length > 0, 'Decision includes rationale reasons');
      assert(body.data?.disclaimer !== undefined, 'Decision includes official disclaimer');
    }

    // 15. Sell / Hold Decision (Missing cropId -> 400)
    {
      const res = await requestJson(`${baseUrl}/api/decisions/sell-hold`, {
        method: 'POST',
        body: {}
      });
      assert(res.status === 400, 'POST /api/decisions/sell-hold with missing cropId returns 400');
    }

    // 16. Weather Endpoint
    {
      const res = await requestJson(`${baseUrl}/api/weather?lat=11.248&lng=75.7804&location=Kozhikode`);
      const body = res.body;
      assert(res.status === 200, 'GET /api/weather returns 200');
      assert(body.data?.current?.tempCelsius !== undefined, 'Weather includes current temperature');
      assert(body.data?.forecast7Day?.length > 0, 'Weather includes 7-day forecast');
      assert(body.data?.agroAdvisories?.length > 0, 'Weather includes agro advisories');
    }

    // 17. Profit Calculator (POST)
    {
      const res = await requestJson(`${baseUrl}/api/profit/calculate`, {
        method: 'POST',
        body: {
          cropId: 'crop-wheat',
          acreage: 2.5
        }
      });
      const body = res.body;
      assert(res.status === 200, 'POST /api/profit/calculate returns 200');
      assert(body.data?.financialSummary?.grossRevenue > 0, 'Profit calculation computed gross revenue');
      assert(body.data?.financialSummary?.totalExpenses > 0, 'Profit calculation computed total expenses');
      assert(typeof body.data?.financialSummary?.netProfit === 'number', 'Profit calculation computed net profit');
      assert(body.data?.costBreakdown?.seedExpense !== undefined, 'Cost breakdown contains seedExpense');
    }

    // 18. AI Assistant (POST)
    {
      const res = await requestJson(`${baseUrl}/api/ai/ask`, {
        method: 'POST',
        body: {
          question: 'What is the recommended fertilizer schedule for wheat?',
          context: { cropName: 'Wheat', location: 'Kozhikode' }
        }
      });
      const body = res.body;
      assert(res.status === 200, 'POST /api/ai/ask returns 200');
      assert(typeof body.data?.answer === 'string' && body.data.answer.length > 20, 'AI Assistant returned thoughtful answer');
      assert(typeof body.data?.mode === 'string', 'AI Assistant response indicates mode');
    }

    // 19. AI Assistant Missing Question (400)
    {
      const res = await requestJson(`${baseUrl}/api/ai/ask`, {
        method: 'POST',
        body: { question: '   ' }
      });
      assert(res.status === 400, 'POST /api/ai/ask with whitespace-only question returns 400');
    }

    // 20. 404 Catch-All Route
    {
      const res = await requestJson(`${baseUrl}/api/unknown-random-route`);
      const body = res.body;
      assert(res.status === 404, 'GET /api/unknown-random-route returns 404');
      assert(body.success === false, '404 route returns success === false');
      assert(body.message?.includes('not found'), '404 returns informative message');
    }

  } finally {
    server.close();
  }

  console.log('\n=======================================================');
  console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('=======================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL BACKEND API CONTRACT TESTS PASSED PERFECTLY!');
  }
};

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
