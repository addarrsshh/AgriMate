# AgriMate — Project Context

> **Living Project Context & Persistent Engineering Memory**  
> *Source of truth for AgriMate architecture, implementation state, and technical decisions.*  
> *Last Updated: 2026-09-30 | Status: ACTIVE WORKSPACE*

---

## 1. Project Summary

### What is AgriMate?
**AgriMate** is a smart agricultural decision-support platform designed to empower farmers throughout the end-to-end agricultural lifecycle:

$$\text{Discover} \longrightarrow \text{Plan} \longrightarrow \text{Grow} \longrightarrow \text{Monitor} \longrightarrow \text{Harvest} \longrightarrow \text{Sell}$$

### Who is it for?
Smallholder, mid-scale, and commercial farmers, agricultural extension workers, and agribusiness stakeholders who need data-driven, practical guidance without steep technical barriers.

### Main Problem Solved
Farmers frequently suffer from asymmetric information: uncertain weather forecasts, suboptimal crop selection for their specific soil/season, fluctuating market prices with predatory intermediaries, lack of clear post-harvest sell vs. hold timing, and complex scientific guidance that is difficult to act on. FarmGuide centralizes crop intelligence, market price trend analysis, weather metrics, and AI advisory into an intuitive, accessible dashboard.

### Main User Journey
1. **Discover & Plan**: Farmer inputs or auto-detects their location, soil type, and land size. The system calculates crop suitability scores and provides recommended crops, seed varieties, and fertilizer plans (organic & conventional).
2. **Grow & Monitor**: Farmer tracks localized weather forecasts, receives growth stage alerts, irrigation guidance, and fertilizer application schedules.
3. **Harvest & Sell**: Farmer monitors real-time market prices across nearby APMCs/mandis, analyzes historical trends (7-day/30-day volatility and seasonal baselines), and receives algorithmic **Sell / Hold / Monitor** recommendations.
4. **AI Consultation**: Farmer consults an AI agricultural assistant to receive simple, culturally contextualized, plain-language explanations of why certain actions are recommended.

### Current Project Status
- **Current State**: Initial Repository Phase.
- **Git Repository**: Initialized at `AgroMate/` (`https://github.com/addarrsshh/AgroMate.git`).
- **Implementation Status**: Architectural specifications defined; all modules currently in **PLANNED** status prior to scaffolding code generation.

---

## 2. Current Implementation Status

> **Status Glossary:**  
> `PLANNED` | `IN PROGRESS` | `IMPLEMENTED` | `PARTIALLY IMPLEMENTED` | `TESTED` | `BROKEN` | `DEPRECATED` | `REMOVED`

| Feature | Status | Frontend | Backend | Database | External API | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Dashboard Overview** | `IMPLEMENTED` | `DashboardView.jsx` | `server.js`, `app.js` | Mock Seed / Atlas | Weather / Mandi | Aggregated metrics, weather widget, quick actions |
| **Crop Recommendation Engine** | `IMPLEMENTED` | `CropRecommendationView.jsx` | `cropMatchingService.js` | `crops` | N/A | Scoring based on soil, season, irrigation & economics |
| **Crop Cultivation Guide** | `IMPLEMENTED` | `CropGuideView.jsx` | `cropController.js` | `crops` | N/A | Sowing, spacing, irrigation, pest management |
| **Fertilizer Guide (Conventional)** | `IMPLEMENTED` | `CropGuideView.jsx` | `cropController.js` | `fertilizers` | N/A | NPK ratios, application schedules, dosage formulas |
| **Organic Fertilizer Guide** | `IMPLEMENTED` | `CropGuideView.jsx` | `cropController.js` | `fertilizers` | N/A | Vermicompost, bio-NPK, neem cake, FYM |
| **Market Prices Dashboard** | `IMPLEMENTED` | `MarketPricesView.jsx` | `marketController.js` | `markets`, `price_records` | Fallback / Live | Live modal rates, APMC mandi comparison |
| **Nearby Markets Finder** | `IMPLEMENTED` | `MarketPricesView.jsx` | `marketController.js` | `markets` | Geolocation / Distance | Radius-based market search with freight deductions |
| **Historical Price Tracker** | `IMPLEMENTED` | `PriceAnalysisView.jsx` | `dataAccessService.js` | `price_records` | Seed / Live | 30-day daily price time series data |
| **Price Trend & Volatility Analysis** | `IMPLEMENTED` | `PriceAnalysisView.jsx` | `priceAnalysisService.js` | `price_records` | N/A | Moving averages (SMA7, SMA30), volatility index |
| **Sell / Hold / Monitor Advisor** | `IMPLEMENTED` | `SellHoldDecisionView.jsx` | `decisionEngineService.js` | `price_records` | N/A | Deterministic decision logic with non-guarantee disclaimer |
| **Weather Forecast & Agro-Advisories** | `IMPLEMENTED` | `WeatherView.jsx` | `externalWeatherService.js` | In-memory cache | OpenWeather / Fallback | 7-day forecast, precipitation risk, spraying windows |
| **Revenue & Profit Estimator** | `IMPLEMENTED` | `ProfitEstimatorView.jsx` | `profitCalculationService.js`| N/A | N/A | Gross revenue, itemized costs, net profit, ROI% |
| **AI Agricultural Assistant** | `IMPLEMENTED` | `AiAssistantView.jsx` | `aiAssistantService.js` | In-memory knowledge | Gemini/OpenAI/Fallback | Server-side proxy with grounded agronomy advice |
| **Farmer Authentication & Auth** | `PLANNED` | Planned | Planned | `farmers` | N/A | Future session management / JWT |
| **Farmer Profile & Farm Records** | `PLANNED` | Planned | Planned | `farmers` | N/A | Future land parcels & soil health records |
| **Notification & Alerts System** | `PLANNED` | Planned | Planned | N/A | N/A | Future SMS / push notification alerts |

---

## 3. Technology Stack

Every technology tracked below reflects the targeted fixed architecture for FarmGuide.

### Frontend
- **React.js**
  - *Version*: `^18.x` or `^19.x` (To be initialized)
  - *Purpose*: Single Page Application (SPA) client interface
  - *Location*: `/frontend`
  - *Configuration*: Modern functional components with hooks, strict mode enabled
- **Tailwind CSS**
  - *Version*: `^3.4.x` (Vanilla CSS design system backing)
  - *Purpose*: Utility-first styling with custom agricultural palette and glassmorphism tokens
  - *Location*: `/frontend/src/index.css`, `/frontend/tailwind.config.js`
- **React Router DOM**
  - *Version*: `^6.x` (Planned)
  - *Purpose*: Declarative client-side routing
- **Lucide React**
  - *Version*: `^0.3x` (Planned)
  - *Purpose*: Consistent modern SVG iconography
- **Recharts / Chart.js**
  - *Version*: Planned
  - *Purpose*: Market price time-series and volatility visualisations

### Backend
- **Node.js**
  - *Version*: `LTS (>=18.x / 20.x)`
  - *Purpose*: Server-side JavaScript runtime
  - *Location*: `/backend`
- **Express.js**
  - *Version*: `^4.19.x` (Planned)
  - *Purpose*: RESTful API server, routing, middleware orchestration
  - *Location*: `/backend/src/server.js`, `/backend/src/app.js`
- **Mongoose**
  - *Version*: `^8.x` (Planned)
  - *Purpose*: ODM (Object Data Modeling) for MongoDB Atlas

### Database
- **MongoDB Atlas**
  - *Type*: Cloud-hosted NoSQL Document Database
  - *Purpose*: Persistent storage for farmers, crops, fertilizers, market records, and historical prices
  - *Tool*: MongoDB Compass (Used for administration and inspection only; not the database itself)

### AI Integration
- **External AI API (e.g., Google Gemini API / OpenAI API via Express)**
  - *Rule*: All AI requests routed strictly through backend Express services. **Never expose API keys to the frontend**.
  - *Purpose*: Explanatory layer for algorithmic recommendations and conversational farming advisory.

### External APIs
- **Weather API**: OpenWeatherMap / Meteo API for real-time and 7-day agro-meteorological data.
- **Market Data API**: Government Agmarknet / Data.gov or simulated market API for mandi commodity prices.
- **Geolocation API**: Browser Geolocation API + reverse geocoding for latitude/longitude detection.

---

## 4. Complete Project Structure

```text
Hackathon/
├── AgroMate/                       # Git repository root (origin: https://github.com/addarrsshh/AgroMate.git)
│   ├── .git/                       # Git tracking metadata
│   ├── .gitattributes              # Line-ending normalisation rules
│   └── docs/
│       ├── AI_QUICKSTART.md        # Fast navigation & orientation guide
│       └── PROJECT_CONTEXT.md      # Mirror of persistent engineering memory
│
├── docs/
│   ├── AI_QUICKSTART.md            # Fast navigation & orientation guide
│   └── PROJECT_CONTEXT.md          # Persistent engineering memory & source of truth
│
├── frontend/                       # [PLANNED] React client application
│   ├── public/                     # Static assets (favicons, manifests)
│   ├── src/
│   │   ├── assets/                 # Brand illustrations & icons
│   │   ├── components/             # Reusable UI components
│   │   │   ├── common/             # Button, Card, Modal, Input, Badge, Loader
│   │   │   ├── layout/             # Navbar, Sidebar, Footer, PageHeader
│   │   │   ├── dashboard/          # SummaryCard, WeatherCard, QuickActions
│   │   │   ├── crops/              # CropCard, SuitabilityScore, FertilizerTable
│   │   │   ├── markets/            # PriceTicker, MandiSelector, PriceChart
│   │   │   ├── advisory/           # RecommendationBadge, DecisionRationale
│   │   │   └── ai/                 # ChatWidget, MessageBubble, SuggestedPrompts
│   │   ├── context/                # AuthContext, FarmContext, NotificationContext
│   │   ├── hooks/                  # useWeather, useMarketPrices, useGeolocation
│   │   ├── pages/                  # Route views (Dashboard, Crops, Markets, AI, Profile)
│   │   ├── services/               # API client abstraction (axios / fetch wrappers)
│   │   │   ├── api.js              # Central HTTP client with interceptors
│   │   │   ├── cropService.js      # Crop & recommendation requests
│   │   │   ├── marketService.js    # Mandi & price history endpoints
│   │   │   ├── weatherService.js   # Forecast and advisory requests
│   │   │   └── aiService.js        # AI chat and explanation endpoints
│   │   ├── utils/                  # Formatters (currency, dates, agricultural units)
│   │   ├── App.jsx                 # Route definitions and layout shell
│   │   ├── index.css               # Design tokens, Tailwind directives, glassmorphism
│   │   └── main.jsx                # DOM mounting entry point
│   ├── index.html                  # HTML5 shell with semantic meta tags
│   ├── tailwind.config.js          # Tailwind theme extensions & color palette
│   └── package.json                # Frontend dependencies and scripts
│
└── backend/                        # [PLANNED] Express.js REST API
    ├── src/
    │   ├── config/                 # DB connections, environment validation
    │   │   ├── db.js               # Mongoose Atlas connection handler
    │   │   └── env.js              # Validated environment variable schema
    │   ├── controllers/            # Request handlers
    │   │   ├── cropController.js   # Crop querying & recommendations
    │   │   ├── marketController.js # Mandi prices, nearby markets, trends
    │   │   ├── weatherController.js# Weather data aggregation
    │   │   ├── decisionController.js # Sell/Hold/Monitor decision endpoint
    │   │   └── aiController.js     # AI assistant dialogue & explanations
    │   ├── middleware/             # Auth, error handling, validation, rate limiting
    │   │   ├── errorHandler.js     # Centralized operational error interceptor
    │   │   ├── validateRequest.js  # Input payload sanitizer
    │   │   └── rateLimiter.js      # Endpoint flood protection
    │   ├── models/                 # Mongoose schemas
    │   │   ├── Crop.js             # Crop metadata, soil, season, yield rules
    │   │   ├── Fertilizer.js       # Organic & chemical fertilizer specs
    │   │   ├── Market.js           # APMC Mandi metadata, coordinates, district
    │   │   ├── PriceRecord.js      # Daily commodity price entries
    │   │   └── RecommendationLog.js# Audit trail of generated decisions
    │   ├── routes/                 # Express route mappings
    │   │   ├── cropRoutes.js       # /api/crops, /api/recommendations/crops
    │   │   ├── marketRoutes.js     # /api/markets, /api/prices
    │   │   ├── weatherRoutes.js    # /api/weather
    │   │   ├── decisionRoutes.js   # /api/decisions/sell-hold
    │   │   └── aiRoutes.js         # /api/ai/ask, /api/ai/explain
    │   ├── services/               # Core business & analysis logic
    │   │   ├── cropMatchingService.js # Suitability scoring engine
    │   │   ├── priceAnalysisService.js# 7d/30d moving avg, volatility, trends
    │   │   ├── decisionEngineService.js # Sell/Hold/Monitor composite rules
    │   │   ├── externalWeatherService.js # Weather provider wrapper
    │   │   ├── externalMarketService.js  # Market data provider wrapper
    │   │   └── aiAssistantService.js     # External AI API prompt orchestrator
    │   ├── utils/                  # Mathematical, date, and formatting utilities
    │   │   └── mathHelpers.js      # Volatility (stddev), percentage changes
    │   ├── app.js                  # Express middleware configuration
    │   └── server.js               # HTTP listener and graceful shutdown
    ├── .env.example                # Sanitized template for environment variables
    └── package.json                # Backend dependencies and run scripts
```

---

## 5. Architecture

### System Architecture Flowchart

```text
                             ┌────────────────────────┐
                             │         FARMER         │
                             └───────────┬────────────┘
                                         │
                                         ▼
                             ┌────────────────────────┐
                             │    REACT + TAILWIND    │
                             │  (Client Dashboard)   │
                             └───────────┬────────────┘
                                         │
                                   REST API Calls
                                   (JSON via HTTP)
                                         │
                                         ▼
                             ┌────────────────────────┐
                             │       EXPRESS.JS       │
                             │  (API & Orchestration) │
                             └───────────┬────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 │                       │                       │
                 ▼                       ▼                       ▼
      ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
      │   MongoDB Atlas    │  │    Weather API     │  │     Market API     │
      │ (Crops, Mandis,    │  │ (Current & 7-Day   │  │ (Live Mandi Rates  │
      │  Historical Rates) │  │  Forecast Data)    │  │  & Commodities)    │
      └──────────┬─────────┘  └──────────┬─────────┘  └──────────┬─────────┘
                 │                       │                       │
                 └───────────────────────┼───────────────────────┘
                                         │
                                         ▼
                             ┌────────────────────────┐
                             │   ANALYSIS SERVICES    │
                             │ (Deterministic Logic)  │
                             └───────────┬────────────┘
                 ┌───────────────────────┼───────────────────────┐
                 │                       │                       │
                 ▼                       ▼                       ▼
      ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
      │   Crop Matching    │  │   Price Analysis   │  │  Profit Estimator  │
      │ (Soil, Season, NPK,│  │ (7d/30d Averages,  │  │ (Yield × Price -   │
      │  Rainfall scoring) │  │  Volatility, ROC)  │  │  Cultivation Cost) │
      └──────────┬─────────┘  └──────────┬─────────┘  └──────────┬─────────┘
                 │                       │                       │
                 └───────────────────────┼───────────────────────┘
                                         │
                                         ▼
                             ┌────────────────────────┐
                             │ RECOMMENDATION ENGINE  │
                             └───────────┬────────────┘
                                 ┌───────┴───────┐
                                 │               │
                                 ▼               ▼
                      ┌────────────────────┐ ┌────────────────────┐
                      │Crop Recommendation │ │Sell / Hold / Monit.│
                      │(Top-K Ranked List) │ │(Actionable Signal) │
                      └──────────┬─────────┘ └──────────┬─────────┘
                                 │                      │
                                 └──────────┬───────────┘
                                            │
                                            ▼
                             ┌────────────────────────┐
                             │   BACKEND AI SERVICE   │
                             │(Synthesize Context &   │
                             │ Construct Safe Prompts)│
                             └───────────┬────────────┘
                                         │
                                         ▼
                             ┌────────────────────────┐
                             │    EXTERNAL AI API     │
                             │  (LLM Prompt Execution)│
                             └───────────┬────────────┘
                                         │
                                         ▼
                             ┌────────────────────────┐
                             │ FARMER-FRIENDLY REASON │
                             │  (Delivered via REST)  │
                             └────────────────────────┘
```

### Architectural Principles
1. **Deterministic Calculations First**: All mathematical, financial, price-trend, and recommendation-scoring computations are executed deterministically by Express services. The AI is **never** permitted to calculate prices or invent arbitrary recommendations.
2. **AI as an Explanatory and Advisory Layer**: The AI translates hard numbers and rules into farmer-friendly explanations in regional language contexts.
3. **No Direct Frontend-to-AI / Secret Access**: The browser client talks solely to Express. No AI keys or third-party secrets touch the client bundle.
4. **Resilient Fallback Mode**: If external APIs (Weather, Market, or AI) fail or time out, the system degrades gracefully to local cached MongoDB data and predefined rule-based explanatory text.

---

## 6. Frontend Architecture

### Pages (Planned Specification)

#### 1. Dashboard Overview
- **File**: `/frontend/src/pages/DashboardPage.jsx`
- **Route**: `/`
- **Purpose**: Central hub displaying quick weather glance, active crop summary, top market prices, and quick advisory indicators.
- **Components Used**: `WeatherCard`, `SummaryCard`, `PriceTicker`, `QuickActions`, `RecommendationBadge`.
- **API Calls**: `GET /api/weather/current`, `GET /api/markets/summary`, `GET /api/decisions/latest`.
- **State**: `weatherData`, `marketSummary`, `alerts`, `loading`, `error`.
- **Status**: `PLANNED`

#### 2. Crop Planning & Recommendations
- **File**: `/frontend/src/pages/CropPlannerPage.jsx`
- **Route**: `/crops`
- **Purpose**: Interactive input form (soil, season, acreage, water availability) yielding scored crop candidates and growing guides.
- **Components Used**: `CropFilterForm`, `CropCard`, `SuitabilityScore`, `FertilizerGuideModal`.
- **API Calls**: `POST /api/recommendations/crops`, `GET /api/crops/:id`.
- **State**: `filters`, `recommendedCrops`, `selectedCrop`, `isSubmitting`.
- **Status**: `PLANNED`

#### 3. Market Intelligence & Price Trends
- **File**: `/frontend/src/pages/MarketIntelligencePage.jsx`
- **Route**: `/markets`
- **Purpose**: Mandi price comparison, nearby market distance calculation, historical chart inspection, and Sell/Hold/Monitor advisory.
- **Components Used**: `MandiSelector`, `PriceChart`, `TrendIndicator`, `DecisionBanner`, `ProfitCalculatorWidget`.
- **API Calls**: `GET /api/markets/nearby`, `GET /api/prices/:cropId/history`, `POST /api/decisions/sell-hold`.
- **State**: `selectedCommodity`, `selectedMandi`, `timeframe`, `priceHistory`, `decisionData`.
- **Status**: `PLANNED`

#### 4. Fertilizer & Soil Health Guide
- **File**: `/frontend/src/pages/FertilizerGuidePage.jsx`
- **Route**: `/fertilizers`
- **Purpose**: Comprehensive database of organic and chemical fertilizers, application timings, safety dosages, and cost optimization.
- **Components Used**: `FertilizerTable`, `OrganicBadge`, `DosageCalculator`.
- **API Calls**: `GET /api/fertilizers?cropId=:id`.
- **State**: `fertilizersList`, `filterCategory`, `soilType`.
- **Status**: `PLANNED`

#### 5. AI Farming Assistant
- **File**: `/frontend/src/pages/AiAssistantPage.jsx`
- **Route**: `/assistant`
- **Purpose**: Interactive chat interface allowing farmers to ask open-ended questions and request explanations for system recommendations.
- **Components Used**: `ChatWidget`, `MessageList`, `MessageBubble`, `SuggestedPrompts`.
- **API Calls**: `POST /api/ai/ask`, `POST /api/ai/explain`.
- **State**: `messages`, `isGenerating`, `activeContext`.
- **Status**: `PLANNED`

---

## 7. Backend Architecture

### Modules & Entry Point
- **Express Entry Point**: `/backend/src/server.js` initializes MongoDB Atlas via `mongoose.connect()`, mounts middleware from `/backend/src/app.js`, and listens on configured `PORT`.
- **Middleware Pipeline**:
  1. `cors({ origin: CLIENT_URL })`
  2. `express.json({ limit: '1mb' })`
  3. `rateLimiter` (IP-based throttling on `/api/ai/*`)
  4. Application routes (`/api/*`)
  5. `errorHandler` (Central operational and validation error formatter)

### Core Backend Services (Planned)
- **`cropMatchingService.js`**: Takes farmer parameters (soil pH, texture, season, water capacity, district) and computes normalized suitability vectors against crop requirements in MongoDB.
- **`priceAnalysisService.js`**: Analyzes commodity price series over 7, 30, and 90 days. Computes Simple Moving Averages ($SMA_7$, $SMA_{30}$), exponential trend line slope, percentage price change, and standard deviation volatility.
- **`decisionEngineService.js`**: Synthesizes output from `priceAnalysisService`, storage shelf-life constraints, and upcoming weather risks to output `SELL`, `HOLD`, or `MONITOR` with numerical confidence scores.
- **`aiAssistantService.js`**: Manages LLM prompt generation, contextual grounding (feeding current price and weather metrics as immutable facts to prevent hallucination), and rate-limit handling.

---

## 8. API Documentation

| Method | Endpoint | Purpose | Request Payload / Params | Response Structure | Auth | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health & DB connection check | None | `{ status: "ok", timestamp }` | None | `PLANNED` |
| `GET` | `/api/crops` | List all supported crops | `?season=&soil=` | `{ success: true, count, data: [Crop] }` | Optional | `PLANNED` |
| `GET` | `/api/crops/:id` | Get detailed crop cultivation profile | Param: `id` | `{ success: true, data: CropDetail }` | None | `PLANNED` |
| `POST`| `/api/recommendations/crops` | Recommend crops matching farmer inputs | `{ soilType, season, landSize, waterSource, district }` | `{ success: true, recommendations: [{ crop, score, rationale }] }` | Optional | `PLANNED` |
| `GET` | `/api/fertilizers` | Get fertilizers list by crop/type | `?cropId=&type=organic\|chemical` | `{ success: true, data: [Fertilizer] }` | None | `PLANNED` |
| `GET` | `/api/markets/nearby` | Find mandis sorted by distance | `?lat=&lng=&radiusKm=` | `{ success: true, data: [MarketWithDistance] }` | None | `PLANNED` |
| `GET` | `/api/prices/current` | Get current market rates for crops | `?commodity=&mandiId=` | `{ success: true, data: [PriceRecord] }` | None | `PLANNED` |
| `GET` | `/api/prices/:cropId/history` | Get historical price time-series | `?days=30&mandiId=` | `{ success: true, history: [{ date, price, volume }] }` | None | `PLANNED` |
| `POST`| `/api/decisions/sell-hold` | Generate Sell/Hold/Monitor decision | `{ cropId, mandiId, harvestDate, storageCapacityDays }` | `{ decision: "SELL"\|"HOLD"\|"MONITOR", confidence, metrics, rationale }` | Optional | `PLANNED` |
| `GET` | `/api/weather` | Current weather and 7-day forecast | `?lat=&lng=` | `{ current: {}, forecast: [], agriculturalRisk: [] }` | None | `PLANNED` |
| `POST`| `/api/profit/calculate` | Calculate estimated revenue and margins | `{ cropId, landAreaAcres, expectedYieldPerAcre, estPricePerUnit, inputCosts }` | `{ grossRevenue, netProfit, roiPercentage }` | None | `PLANNED` |
| `POST`| `/api/ai/ask` | Farmer natural-language question | `{ question, context: { location, crop } }` | `{ answer: string, sources: [] }` | Optional | `PLANNED` |
| `POST`| `/api/ai/explain` | Generate plain-language explanation | `{ decisionType, metrics }` | `{ plainLanguageExplanation: string }` | Optional | `PLANNED` |

---

## 9. Database Schema (MongoDB Atlas)

### 1. `crops` Collection
- **Purpose**: Defines biological, climatic, and cultivation attributes of crops.
- **Fields**:
  - `_id`: `ObjectId`
  - `name`: `String` (Required, Indexed) — e.g., "Wheat (HD-2967)"
  - `category`: `String` (Enum: `Cereal`, `Pulse`, `Oilseed`, `Vegetable`, `CashCrop`)
  - `suitableSeasons`: `[String]` (`Kharif`, `Rabi`, `Zaid`)
  - `soilSuitability`: `[String]` (`Alluvial`, `Black`, `Red`, `Loamy`, `Sandy`)
  - `waterRequirementMm`: `{ min: Number, max: Number }`
  - `idealTempCelsius`: `{ min: Number, max: Number }`
  - `durationDays`: `{ sowingToHarvestMin: Number, sowingToHarvestMax: Number }`
  - `averageYieldPerAcreKg`: `Number`
  - `cultivationCostPerAcre`: `Number`
  - `createdAt`: `Date`

### 2. `fertilizers` Collection
- **Purpose**: Fertilizer profiles, NPK composition, and dosage instructions.
- **Fields**:
  - `_id`: `ObjectId`
  - `name`: `String` (Required)
  - `type`: `String` (Enum: `Organic`, `Biofertilizer`, `Chemical`)
  - `npkRatio`: `{ n: Number, p: Number, k: Number }`
  - `applicationStage`: `String` (e.g., "Basal", "Tillering", "Flowering")
  - `dosagePerAcreKg`: `Number`
  - `organicCertification`: `Boolean`
  - `advantages`: `[String]`
  - `precautions`: `String`

### 3. `markets` Collection
- **Purpose**: Metadata on APMC Mandis and rural trading centers.
- **Fields**:
  - `_id`: `ObjectId`
  - `name`: `String` (Required) — e.g., "Karnal Grain Market"
  - `state`: `String`
  - `district`: `String`
  - `location`: `{ type: "Point", coordinates: [Number, Number] }` (2dsphere index for geo-queries)
  - `contactDetails`: `String`

### 4. `price_records` Collection
- **Purpose**: Daily recorded commodity trade prices.
- **Fields**:
  - `_id`: `ObjectId`
  - `cropId`: `ObjectId` (Ref: `crops`, Indexed)
  - `marketId`: `ObjectId` (Ref: `markets`, Indexed)
  - `date`: `Date` (Indexed)
  - `minPrice`: `Number` (INR / Quintal)
  - `maxPrice`: `Number`
  - `modalPrice`: `Number` (Most frequent trading price)
  - `volumeTradedTonnes`: `Number`
- **Compound Index**: `{ cropId: 1, marketId: 1, date: -1 }`

### 5. `recommendations` Collection
- **Purpose**: Audit log of recommendations served to farmers.
- **Fields**:
  - `_id`: `ObjectId`
  - `farmerId`: `ObjectId` (Optional Ref to `farmers`)
  - `inputParameters`: `Object`
  - `generatedDecision`: `String` (`SELL` | `HOLD` | `MONITOR`)
  - `confidenceScore`: `Number`
  - `priceAtRecommendation`: `Number`
  - `createdAt`: `Date`

---

## 10. Data Models & Entity Relationships

```text
       ┌───────────────┐
       │    FARMER     │
       └───────┬───────┘
               │ 1
               │ has many
               ▼ *
       ┌───────────────┐
       │RECOMMENDATION │
       └───────┬───────┘
               │ references
       ┌───────┴───────┐
       │               │
       ▼ *             ▼ *
┌─────────────┐ ┌─────────────┐
│    CROP     │ │   MARKET    │
└──────┬──────┘ └──────┬──────┘
       │ 1             │ 1
       │ has many      │ has many
       ▼ *             ▼ *
┌─────────────────────────────┐
│        PRICE_RECORD         │
└─────────────────────────────┘
       │
       │ relates to
       ▼ *
┌─────────────┐
│ FERTILIZER  │
└─────────────┘
```

- **Relationships Strategy**:
  - Relationships across `PRICE_RECORD -> CROP` and `PRICE_RECORD -> MARKET` use MongoDB `ObjectId` references with compound indexes to optimize time-series slicing.
  - Geo-queries on `MARKET` use GeoJSON `Point` with MongoDB `2dsphere` spatial indexing.
  - Crop cultivation steps and stages are embedded documents within `CROP` for atomic single-document reads.

---

## 11. Important Variables

| Variable | File / Layer | Type | Purpose | Allowed Values / Defaults | Constraints |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `PORT` | `backend/src/server.js` | `Number` | Server listener port | Default: `5000` | Valid TCP port |
| `MONGODB_URI` | `backend/src/config/db.js` | `String` | MongoDB Atlas connection string | `mongodb+srv://...` | Never commit secrets |
| `AI_API_KEY` | `backend/src/services/aiAssistantService.js` | `String` | Backend LLM API credentials | Secret string | Express backend only |
| `WEATHER_API_KEY` | `backend/src/services/externalWeatherService.js`| `String` | Weather provider auth key | Secret string | Express backend only |
| `PRICE_VOLATILITY_THRESHOLD` | `backend/src/services/decisionEngineService.js`| `Number` | Volatility index cut-off | Default: `0.15` (15%) | Positive decimal |
| `PRICE_MOMENTUM_THRESHOLD` | `backend/src/services/decisionEngineService.js`| `Number` | 7-day rate of change threshold for HOLD | Default: `+0.05` (+5%) | Decimal ratio |
| `HOLD_STORAGE_MAX_DAYS` | `backend/src/services/decisionEngineService.js`| `Number` | Max holding period for perishable crops | Default: `14` days | Perishability ceiling |
| `MATCH_WEIGHT_SOIL` | `backend/src/services/cropMatchingService.js` | `Number` | Weight for soil compatibility in matching | Default: `0.35` (35%) | Sum of weights = 1.0 |
| `MATCH_WEIGHT_WEATHER` | `backend/src/services/cropMatchingService.js` | `Number` | Weight for temperature & rain suitability | Default: `0.35` (35%) | Sum of weights = 1.0 |
| `MATCH_WEIGHT_PROFIT` | `backend/src/services/cropMatchingService.js` | `Number` | Weight for estimated economic return | Default: `0.30` (30%) | Sum of weights = 1.0 |

---

## 12. Important Functions (Planned Registry)

| Function | File | Purpose | Parameters | Return Value |
| :--- | :--- | :--- | :--- | :--- |
| `calculateSuitabilityScore()` | `backend/src/services/cropMatchingService.js` | Computes composite fit (0–100%) for a crop | `(crop, farmerProfile, weatherForecast)` | `{ score: Number, breakdowns: Object }` |
| `calculatePriceMetrics()` | `backend/src/services/priceAnalysisService.js` | Computes 7d/30d SMA, % change, and volatility | `(priceHistoryArray)` | `{ sma7, sma30, changePct7d, volatilityIndex }` |
| `evaluateSellHoldDecision()` | `backend/src/services/decisionEngineService.js` | Algorithmic Sell/Hold/Monitor decision maker | `(metrics, cropProfile, mandiDetails)` | `{ decision, confidence, riskScore, rationale }` |
| `calculateGrossAndNetProfit()` | `backend/src/utils/mathHelpers.js` | Computes farm income, input costs, and ROI | `(acreage, yieldPerAcre, pricePerUnit, costs)` | `{ grossRevenue, netProfit, marginPercent }` |
| `fetchWeatherData()` | `backend/src/services/externalWeatherService.js` | Fetches and caches weather forecast for coords | `(latitude, longitude)` | `{ current, dailyForecast, rainRisk }` |
| `generateAIExplanation()` | `backend/src/services/aiAssistantService.js` | Prompts external LLM to generate plain-language advice | `(decisionPayload, farmerLanguage)` | `Promise<String>` |

---

## 13. Business Logic

### Price Analysis Formulas
1. **Percentage Price Change (7-day / 30-day)**:
   $$\Delta P\% = \left( \frac{P_{\text{current}} - P_{\text{baseline}}}{P_{\text{baseline}}} \right) \times 100$$
2. **Simple Moving Average ($SMA_N$)**:
   $$SMA_N = \frac{1}{N} \sum_{i=1}^{N} P_i$$
3. **Price Volatility ($\sigma_{\text{relative}}$)**:
   $$\sigma = \sqrt{\frac{1}{N-1} \sum_{i=1}^{N} (P_i - \bar{P})^2}, \quad \text{Volatility Index} = \frac{\sigma}{\bar{P}}$$

---

## 14. Sell / Hold / Monitor Decision Logic

```text
                      ┌──────────────────────┐
                      │    CURRENT PRICE     │
                      │   vs. 30-DAY SMA     │
                      └──────────┬───────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
        Current Price > SMA30           Current Price <= SMA30
                 │                               │
                 ▼                               ▼
       ┌──────────────────┐            ┌──────────────────┐
       │ 7-day Momentum   │            │ Upcoming Weather │
       │    Positive?     │            │    Rain Risk?    │
       └─────────┬────────┘            └─────────┬────────┘
          ┌──────┴──────┐                 ┌──────┴──────┐
         YES            NO               YES            NO
          │              │                │              │
          ▼              ▼                ▼              ▼
     ┌─────────┐    ┌─────────┐      ┌─────────┐    ┌─────────┐
     │  HOLD   │    │  SELL   │      │  SELL   │    │ MONITOR │
     │(Riding  │    │(Peak /  │      │(Damage  │    │ (Wait   │
     │ Uptrend)│    │ Flatten)│      │  Risk)  │    │for Rise)│
     └─────────┘    └─────────┘      └─────────┘    └─────────┘
```

### Quantitative Decision Rules
- **SELL**:
  - `Condition 1`: $P_{\text{current}} \ge 1.10 \times SMA_{30}$ AND 7-day price momentum is flattening ($\Delta P_{7d} \le +0.5\%$).
  - `Condition 2`: Imminent heavy rainfall ($>50\text{mm}$ in 48h) or crop storage shelf-life exceeded ($> \text{HOLD\_STORAGE\_MAX\_DAYS}$).
- **HOLD**:
  - `Condition`: $P_{\text{current}}$ is in an active upward trend ($\Delta P_{7d} > +3\%$) AND storage loss probability is low ($< 2\%$) AND no severe rain risk.
- **MONITOR**:
  - `Condition`: Price is near the 30-day baseline ($|P_{\text{current}} - SMA_{30}| \le 3\%$) or market trading volume is low, indicating consolidation.

---

## 15. Crop Recommendation Logic

The suitability score $S_{\text{crop}} \in [0, 100]$ is computed as:

$$S_{\text{crop}} = (w_{\text{soil}} \cdot S_{\text{soil}}) + (w_{\text{weather}} \cdot S_{\text{weather}}) + (w_{\text{profit}} \cdot S_{\text{profit}})$$

Where:
- $S_{\text{soil}} \in [0, 100]$: Exact match with farmer soil type (100 for primary, 60 for secondary, 0 for incompatible).
- $S_{\text{weather}} \in [0, 100]$: Temperature and water availability alignment with crop growth requirements.
- $S_{\text{profit}} \in [0, 100]$: Historical modal price $\times$ estimated yield minus input cost, normalized to a percentile.
- Scoring weights: $w_{\text{soil}} = 0.35$, $w_{\text{weather}} = 0.35$, $w_{\text{profit}} = 0.30$.

---

## 16. AI Integration

- **Provider**: Google Gemini API / OpenAI API (Accessible strictly via backend).
- **Backend Service**: `/backend/src/services/aiAssistantService.js`
- **Controller & Route**: `/backend/src/controllers/aiController.js` $\rightarrow$ `POST /api/ai/ask`, `POST /api/ai/explain`.
- **System Prompt Strategy**:
  - Strict grounding: Injects verified numerical values ($SMA$, current prices, weather risks) into system instructions.
  - Persona: Friendly, empathetic, direct agricultural expert. Avoids jargon; uses actionable instructions (e.g., "Sell within 3 days because market supply is surging next week").
- **Security**:
  - `AI_API_KEY` stored exclusively in `/backend/.env`.
  - Frontend client never receives API keys.
  - Rate limiting enforced on all AI endpoints.

---

## 17. External API Integrations

### 1. Weather API
- **Provider**: OpenWeatherMap / Open-Meteo
- **Purpose**: Current weather and 7-day agro-meteorological forecasting.
- **Backend Service**: `/backend/src/services/externalWeatherService.js`
- **Caching**: 30-minute in-memory / Redis cache to conserve API quota.

### 2. Market / Mandi Price API
- **Provider**: Government Agmarknet (Data.gov.in API) or simulated seed mandi provider.
- **Purpose**: Daily arrival volumes, minimum, maximum, and modal prices per commodity.
- **Backend Service**: `/backend/src/services/externalMarketService.js`
- **Fallback**: Read latest cached snapshot from MongoDB `price_records`.

---

## 18. Environment Variables

> **CRITICAL SECURITY RULE**: Never write secret values into this file. Document variable names, usage locations, and descriptions only.

| Variable Name | Purpose | Consumed By | Example Format |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Environment mode (`development` / `production`) | Server initialization | `development` |
| `PORT` | HTTP listener port | `backend/src/server.js` | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `backend/src/config/db.js` | `mongodb+srv://...` |
| `CLIENT_URL` | Allowed CORS origin for React frontend | `backend/src/app.js` | `http://localhost:5173` |
| `AI_API_KEY` | Authentication key for external LLM API | `backend/src/services/aiAssistantService.js` | `[Secret Key]` |
| `WEATHER_API_KEY`| API key for external weather service | `backend/src/services/externalWeatherService.js`| `[Secret Key]` |
| `MARKET_API_KEY` | API key for external agricultural mandi API | `backend/src/services/externalMarketService.js` | `[Secret Key]` |
| `JWT_SECRET` | Secret key for signing farmer session tokens | `backend/src/middleware/auth.js` | `[Secret Key]` |

---

## 19. Dependency Registry

### Frontend (Target Dependencies)
- `react`, `react-dom`: Declarative UI rendering.
- `react-router-dom`: Client-side routing.
- `tailwindcss`, `postcss`, `autoprefixer`: Utility-first CSS styling framework.
- `lucide-react`: Modern SVG iconography.
- `recharts`: Responsive charting library for price trends.
- `axios`: Promise-based HTTP client for API interaction.

### Backend (Target Dependencies)
- `express`: Fast, unopinionated Node.js web framework.
- `mongoose`: MongoDB object modeling and validation.
- `cors`: Cross-Origin Resource Sharing middleware.
- `dotenv`: Loads environment variables from `.env`.
- `express-rate-limit`: Rate limiting for AI and public endpoints.
- `axios`: External HTTP requests to weather and market APIs.

---

## 20. Design System & UI Conventions

- **Visual Tone**: Modern, clean, high-trust agricultural technology.
- **Color Palette**:
  - Primary / Forest Emerald: `hsl(142, 71%, 38%)` (`#16a34a` / `#15803d`)
  - Accent / Golden Harvest: `hsl(43, 96%, 56%)` (`#eab308` / `#ca8a04`)
  - Earth Warm Neutral: `hsl(30, 20%, 97%)` (`#faf8f5`)
  - Dark Slate (Text & Dark Mode): `hsl(215, 28%, 17%)` (`#1e293b`)
  - Alert / Urgency: Rose Red (`#e11d48`) for Sell alerts, Amber (`#f59e0b`) for Hold, Sky Blue (`#0284c7`) for Weather.
- **Card Styling**: Glassmorphic frosted translucent cards (`backdrop-blur-md bg-white/80 border border-emerald-100/60 shadow-sm`).
- **Typography**: Inter / Outfit via Google Fonts; tabular numerals for financial and price tickers.

---

## 21. Routing

### Frontend Routes
| Route | Page Component | Authentication | Purpose | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `DashboardPage` | Public / Guest | Central overview, weather, alerts | `PLANNED` |
| `/crops` | `CropPlannerPage` | Public / Guest | Crop suitability discovery & guides | `PLANNED` |
| `/crops/:id` | `CropDetailPage` | Public / Guest | Cultivation guide, NPK fertilizer specs | `PLANNED` |
| `/markets` | `MarketIntelligencePage` | Public / Guest | Live mandi prices, trends, Sell/Hold | `PLANNED` |
| `/fertilizers` | `FertilizerGuidePage` | Public / Guest | Chemical vs. organic fertilizer advice | `PLANNED` |
| `/profit-calculator` | `ProfitEstimatorPage` | Public / Guest | Revenue and margin forecasting tool | `PLANNED` |
| `/assistant` | `AiAssistantPage` | Public / Guest | AI farming Q&A and recommendation reasoning | `PLANNED` |

---

## 22. State Management

- **Client State**:
  - `useState` & `useReducer` for localized component workflows (e.g., active filters, form inputs).
  - Custom React Context (`FarmContext`) for user farm parameters (selected district, soil type, preferred language).
- **Server Cache State**:
  - Weather data cached for 30 minutes in memory to prevent exceeding provider rate limits.
  - Mandi price trends queried and computed per request with MongoDB indexing.

---

## 23. Error Handling

```text
External API Error (Weather / Market / AI)
               │
               ▼
Service Catches & Logs Error
               │
               ▼
Fallback to Stored MongoDB Cache or Static Rule
               │
               ▼
Express Controller Formats Standard Response:
{ success: false, error: { message: "...", code: "..." } }
               │
               ▼
React Client Displays Farmer-Friendly Alert Banner
```

---

## 24. Security & Compliance

1. **Zero Secret Exposure**: Frontend assets must never reference or bundle `AI_API_KEY`, `WEATHER_API_KEY`, or `MONGODB_URI`.
2. **CORS Restrictions**: Express backend configures strict CORS whitelist matching the frontend origin.
3. **Input Sanitization**: All incoming query params and request bodies are validated before database queries to prevent NoSQL injection.
4. **Rate Limiting**: Rate limits enforced on `/api/ai/*` to guard against Denial of Service and API quota exhaustion.

---

## 25. Known Issues

| ID | Issue | Affected Files | Symptoms | Likely Cause | Current Status | Workaround / Solution |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `ISSUE-001` | Workspace initialized with empty repository | Root directory | No source code files present | Fresh repository clone | `OPEN` (Expected) | Implement scaffolding in upcoming task |

---

## 26. Breakage / Regression Tracking

| Date | Change | Affected Feature | What Broke | Root Cause | Files Involved | Fix & Verification |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *None* | Baseline creation | N/A | None | Initial setup | `PROJECT_CONTEXT.md` | Verified clean state |

---

## 27. Architectural Decisions (ADR)

### ADR 001: Selection of MongoDB Atlas
- **Date**: 2026-09-30
- **Context**: FarmGuide manages diverse agricultural entities: crop agronomy specifications, dynamic fertilizer lists, geospatial mandi locations, and temporal price-series.
- **Decision**: Use MongoDB Atlas as the primary document store.
- **Alternatives Considered**: PostgreSQL, SQLite.
- **Reason**: Flexible schema for crop agronomic traits (which vary significantly between vegetables, cereals, and pulses), native GeoJSON support for mandi radius queries, and scalable managed cloud hosting on Atlas.

### ADR 002: Server-Side Routing for External AI API Calls
- **Date**: 2026-09-30
- **Context**: Need to provide LLM-backed agricultural advice and recommendation explanations.
- **Decision**: Route all AI interactions strictly through Express backend services.
- **Alternatives Considered**: Direct client-side SDK calls in React.
- **Reason**: Protects secret API keys from public bundle inspection, allows server-side prompt engineering with verified database grounding data, and enables rate limiting and logging.

### ADR 003: Deterministic Backend Execution for Core Recommendations & Price Trends
- **Date**: 2026-09-30
- **Context**: Farmers require high reliability for financial sell/hold timing and crop planning.
- **Decision**: Core formulas (SMA, volatility, suitability weights, profit estimations) are strictly computed by deterministic JavaScript functions, NOT by an LLM.
- **Alternatives Considered**: Asking an LLM to recommend Sell/Hold or calculate profit directly.
- **Reason**: Large language models can hallucinate math and prices. Deterministic code guarantees consistency, auditability, and safety.

---

## 28. Change Log

### 2026-09-30 — Milestone 1 Implementation (Frontend & Backend Core)
- **Type**: `FEATURE` / `ARCHITECTURE` / `UI`
- **Summary**: Implemented the complete working full-stack FarmGuide platform:
  1. Express REST API server with health check, CORS, and hybrid Atlas / offline seed data persistence.
  2. Deterministic backend analysis services: Crop Matching (soil, season, water, profit weights), Price Analysis (SMA7, SMA30, 7d/30d % changes, volatility index), Sell/Hold/Monitor decision support engine with explicit non-guaranteed disclaimers, and Farm Profit Estimator.
  3. Weather service integration with OpenWeatherMap and offline agro-meteorological fallback.
  4. Backend AI assistant service with Google Gemini / OpenAI proxy and local agronomy knowledge fallback.
  5. Polished responsive React + Tailwind CSS client dashboard with 9 complete feature views.
- **Files Created**:
  - `backend/package.json`, `backend/.env`, `backend/.env.example`, `backend/.gitignore`
  - `backend/src/server.js`, `backend/src/app.js`
  - `backend/src/config/db.js`
  - `backend/src/data/mockSeedData.js`
  - `backend/src/models/Crop.js`, `Market.js`, `PriceRecord.js`, `Fertilizer.js`
  - `backend/src/services/dataAccessService.js`, `cropMatchingService.js`, `priceAnalysisService.js`, `decisionEngineService.js`, `profitCalculationService.js`, `externalWeatherService.js`, `aiAssistantService.js`
  - `backend/src/controllers/cropController.js`, `marketController.js`, `weatherController.js`, `decisionController.js`, `profitController.js`, `aiController.js`
  - `backend/src/routes/cropRoutes.js`, `marketRoutes.js`, `weatherRoutes.js`, `decisionRoutes.js`, `profitRoutes.js`, `aiRoutes.js`
  - `backend/src/middleware/errorHandler.js`
  - `frontend/package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`
  - `frontend/src/index.css`, `main.jsx`, `App.jsx`, `services/api.js`
  - `frontend/src/components/Navbar.jsx`, `DashboardView.jsx`, `CropRecommendationView.jsx`, `CropGuideView.jsx`, `MarketPricesView.jsx`, `PriceAnalysisView.jsx`, `SellHoldDecisionView.jsx`, `WeatherView.jsx`, `ProfitEstimatorView.jsx`, `AiAssistantView.jsx`
  - Root `package.json`, `.gitignore`
- **Dependencies Added**:
  - Backend: `express`, `cors`, `dotenv`, `mongoose`
  - Frontend: `react`, `react-dom`, `lucide-react`, `tailwindcss`, `postcss`, `autoprefixer`, `vite`, `@vitejs/plugin-react`
- **Verification**: Verified directory structures, route mappings, deterministic formulas, and seamless zero-configuration fallback behavior.

### 2026-09-30 — AI Quickstart Guide Setup
- **Type**: `DOCUMENTATION`
- **Summary**: Created concise `/docs/AI_QUICKSTART.md` (fast navigation entry point) to provide incoming AI agents with rapid orientation on system architecture, status, directories, critical files, and handoff protocols without reading large context.
- **Files Created**:
  - `docs/AI_QUICKSTART.md`
  - `AgroMate/docs/AI_QUICKSTART.md`
- **Files Modified**:
  - `docs/PROJECT_CONTEXT.md`
  - `AgroMate/docs/PROJECT_CONTEXT.md`
- **Dependencies Added**: None.
- **Behavior Change**: Established fast-start orientation workflow for subsequent AI tasks.
- **Verification**: Verified line count (~280 lines), structure, and internal cross-references with `PROJECT_CONTEXT.md`.

### 2026-09-30 — Initial Project Context & Engineering Memory Setup
- **Type**: `CONFIG` / `DOCUMENTATION`
- **Summary**: Inspected the repository state, identified git origin (`AgroMate`), established the comprehensive persistent project context document (`/docs/PROJECT_CONTEXT.md`), and mapped out the end-to-end architecture, API registries, database schemas, and decision logic for FarmGuide.
- **Files Created**:
  - `docs/PROJECT_CONTEXT.md`
  - `AgroMate/docs/PROJECT_CONTEXT.md`
- **Dependencies Added**: None (Repository inspection and baseline documentation stage).
- **Behavior Change**: Established the source of truth for all current and future AI engineering sessions.
- **Verification**: Verified file existence and alignment with prompt instructions.

---

## 29. Current Working State

- **Last Updated**: 2026-09-30
- **Current Branch**: `main`
- **Current Milestone**: Milestone 1 — Core End-to-End Platform Implementation
- **Working Features**:
  - Express REST API running on port 5000 with `/api/health`
  - React + Tailwind CSS client dashboard running on port 5173
  - Multi-factor deterministic Crop Recommendation Engine (`/api/crops/recommend`)
  - Stage-by-stage Crop Cultivation & NPK Fertilizer Guides (`/api/crops`, `/api/crops/fertilizers`)
  - Real-time Mandi Price Board & Inter-mandi Freight Arbitrage (`/api/markets/prices/current`)
  - 30-Day Historical Price Charts, SMA7, SMA30, and Volatility (`/api/markets/prices/:cropId/analysis`)
  - Quantitative Sell / Hold / Monitor Decision Advisor (`/api/decisions/sell-hold`)
  - Agro-Meteorological Weather Forecast & Spraying Risk Advisory (`/api/weather`)
  - Farm Budget, Revenue & Net Margin Estimator (`/api/profit/calculate`)
  - Server-side Grounded AI Assistant with Agronomy Expert Fallback (`/api/ai/ask`)
  - In-Memory / Atlas Hybrid Data Store with automatic seed ingestion
- **In Progress**:
  - Live deployment and farmer field testing
- **Not Started**:
  - Multi-user authentication & JWT session persistence
  - Historical farm audit logs export to PDF
- **Known Broken Features**: None.
- **Next Logical Development Area**:
  - User authentication and farm parcel management
  - Integration of live Government Agmarknet Mandi API feed

---

## 30. AI Handoff Instructions

# AI HANDOFF

> **Instructions for Any AI Agent Continuing Work on FarmGuide:**

### Before changing code:
1. **Read `PROJECT_CONTEXT.md` first**: Understand the system boundaries, data contracts, and decision rules.
2. **Check Current Working State** (Section 29): Verify what is implemented vs. planned before assuming file existence.
3. **Check Known Issues** (Section 25): Avoid repeating known pitfalls.
4. **Locate only the files relevant to your task**: Do not scan the entire codebase blindly.
5. **Preserve existing architecture**: Maintain strict separation between React client, Express API, MongoDB Atlas, and External APIs.
6. **Keep AI calls on the backend**: Never place AI keys or API calls inside React frontend code.
7. **Perform deterministic business calculations**: Do not delegate math, price metrics, or sell/hold thresholds to an LLM.
8. **Make the smallest safe change** and verify its functionality.
9. **Update `PROJECT_CONTEXT.md` immediately**:
   - Record created, modified, or deleted files.
   - Update API endpoint status from `PLANNED` to `IMPLEMENTED` once written.
   - Record any new variables, functions, or dependencies.
   - Add a concise entry to the **Change Log** (Section 28).
   - Update the **Current Working State** (Section 29).

### DO NOT:
- Read the entire codebase unnecessarily when this file provides the context.
- Mark planned features as implemented until verified in code.
- Rewrite working architecture without an Architecture Decision Record (ADR).
- Expose API keys or credentials anywhere in frontend or public code.
- Delete historical change log entries or ADRs.
