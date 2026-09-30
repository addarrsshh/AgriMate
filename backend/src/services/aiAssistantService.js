const https = require('https');

/**
 * AI Assistant Service for AgriMate
 * 
 * Secure Backend LLM Proxy:
 * - API Key stays exclusively on the Express server.
 * - Injects verified agronomic & price facts into the prompt (anti-hallucination grounding).
 * - Full offline / zero-key fallback with rule-based agricultural intelligence.
 */

const postJson = (url, body, headers = {}) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(body);

    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          reject(new Error(`Failed to parse AI provider JSON: ${e.message}`));
        }
      });
    });

    req.on('error', err => reject(err));
    req.write(postData);
    req.end();
  });
};

// Intelligent Rule-Based Fallback Engine
const getRuleBasedAnswer = (question, context = {}) => {
  const q = question.toLowerCase();
  
  if (q.includes('yellow rust') || q.includes('rust')) {
    return "Yellow rust in wheat is caused by Puccinia striiformis. Symptoms include yellow stripes of powdery spores along leaf veins. Organically, apply Neem oil (1500ppm) @ 3ml/L. For chemical control, spray Propiconazole 25% EC @ 1ml/L or Tebuconazole 25.9% EC in 200 liters of water per acre immediately on first appearance.";
  }

  if (q.includes('fertilizer') || q.includes('urea') || q.includes('dap') || q.includes('npk')) {
    return "Balanced fertilization is critical for yield. For cereals like Wheat/Paddy, standard NPK is 120:60:40 kg/ha. Apply all Phosphorus (DAP) and Potassium (MOP) as basal at sowing. Split Nitrogen (Urea) into 2-3 top-dressings: 1st at 21 days (Crown Root Initiation) and 2nd at 45 days (Tillering). Combining with 5-10 tonnes of FYM improves soil organic carbon.";
  }

  if (q.includes('irrigation') || q.includes('water') || q.includes('cri')) {
    return "Irrigation timing depends on critical crop stages. In Wheat, Crown Root Initiation (20-25 days after sowing) is the single most critical stage—missing it can cause 30-40% yield drop. Subsequent irrigations should align with Tillering (40-45 DAS), Booting (65 DAS), and Flowering (85-90 DAS). Avoid irrigation during high wind speeds to prevent lodging.";
  }

  if (q.includes('sell') || q.includes('hold') || q.includes('price') || q.includes('mandi')) {
    return "For market timing: Check the 'Price Analysis' tab in AgriMate for the 7-day and 30-day Simple Moving Average (SMA). If current modal price is > 10% above the 30-day average and momentum is slowing, consider selling to lock in profits. If prices are rising > 3% week-on-week and you have safe storage, holding for 5-7 days can yield higher returns.";
  }

  if (q.includes('pest') || q.includes('insect') || q.includes('aphid') || q.includes('bollworm')) {
    return "Integrated Pest Management (IPM): 1) Install 5 yellow sticky traps per acre for sucking pests (aphids/whitefly), 2) Install pheromone traps for borers, 3) Spray 5% Neem Seed Kernel Extract (NSKE) preventively, 4) Only resort to targeted chemical insecticides if pest population crosses the Economic Threshold Level (ETL).";
  }

  return "AgriMate Agricultural Advisory: For optimal crop yield, ensure soil testing every 2-3 years, maintain appropriate seed spacing, and follow integrated nutrient management (combining organic manure with balanced chemical fertilizers). Use our 'Crop Recommendation' and 'Market Prices' modules to tailor decisions to your specific district and season.";
};

const askAgriculturalAssistant = async (question, context = {}) => {
  const apiKey = process.env.AI_API_KEY;
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

  // If no API key configured, use agricultural expert system fallback
  if (!apiKey) {
    return {
      answer: getRuleBasedAnswer(question, context),
      mode: "development-expert-system",
      notice: "AI_API_KEY not configured in backend/.env. Using AgriMate Agronomy Knowledge Base.",
      suggestedFollowUps: [
        "How do I control yellow rust in wheat?",
        "What is the best fertilizer schedule for basmati paddy?",
        "When is the best time to sell my mustard crop?"
      ]
    };
  }

  // Grounding System Instructions
  const systemPrompt = `You are AgriMate AI, a knowledgeable, empathetic agricultural scientist and farming advisor.
You provide clear, practical, farmer-friendly guidance in simple language.
Context:
- Location: ${context.location || "North India"}
- Crop in discussion: ${context.cropName || "General Agricultural Crops"}
- Current Market / Weather Context: ${JSON.stringify(context)}

CRITICAL INSTRUCTIONS:
1. Provide actionable agronomic or market advice.
2. Emphasize organic and integrated pest management (IPM) where feasible.
3. Keep instructions easy to understand for smallholder farmers.
4. If asked about prices or sell/hold timing, reference that market prices fluctuate and recommend verifying local mandi arrivals.`;

  try {
    if (provider === 'gemini') {
      const candidateModels = [
        process.env.AI_MODEL || 'gemini-flash-latest',
        'gemini-flash-latest',
        'gemini-3.1-flash-lite',
        'gemini-3.8-flash'
      ];
      const uniqueModels = [...new Set(candidateModels.filter(Boolean))];

      let lastError = null;
      for (const model of uniqueModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const payload = {
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\nFarmer Question: ${question}` }]
              }
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 600
            }
          };

          const response = await postJson(url, payload);
          if (response.status === 200 && response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return {
              answer: response.data.candidates[0].content.parts[0].text,
              mode: `live-llm (${model})`,
              model: model
            };
          }
          lastError = new Error(`Gemini (${model}) returned status ${response.status}: ${response.data?.error?.message || 'Unknown error'}`);
        } catch (err) {
          lastError = err;
        }
      }
      throw lastError || new Error('Failed to query Gemini API');
    } else {
      // OpenAI compatible format
      const url = "https://api.openai.com/v1/chat/completions";
      const payload = {
        model: process.env.AI_MODEL || "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        temperature: 0.4,
        max_tokens: 500
      };

      const response = await postJson(url, payload, { 'Authorization': `Bearer ${apiKey}` });
      if (response.status === 200 && response.data?.choices?.[0]?.message?.content) {
        return {
          answer: response.data.choices[0].message.content,
          mode: "live-llm (OpenAI)",
          model: payload.model
        };
      }
      throw new Error(`OpenAI response error code: ${response.status}`);
    }
  } catch (error) {
    console.warn(`[AI Assistant] External API request failed (${error.message}). Falling back to agronomy knowledge base.`);
    return {
      answer: getRuleBasedAnswer(question, context),
      mode: "fallback-expert-system",
      notice: `External AI call failed (${error.message}). Response served via AgriMate Agronomy Knowledge Base.`,
      suggestedFollowUps: [
        "How do I control yellow rust in wheat?",
        "What is the best fertilizer schedule for basmati paddy?",
        "When is the best time to sell my mustard crop?"
      ]
    };
  }
};

module.exports = {
  askAgriculturalAssistant
};
