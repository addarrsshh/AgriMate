# FarmGuide — AI Quickstart

> **Fast Navigation & Project Orientation Guide**  
> *Targeted entry point for AI agents. For complete specifications, see [PROJECT_CONTEXT.md](file:///c:/Users/PC/Desktop/Hackathon/docs/PROJECT_CONTEXT.md).*  
> *Last Updated: 2026-09-30 | Status: INITIAL REPOSITORY STATE (MILESTONE 0)*

---

## 1. What Is FarmGuide?

**FarmGuide** (repository: `AgroMate`) is a smart agricultural decision-support platform designed to help farmers choose suitable crops, understand cultivation requirements, monitor weather, compare nearby market prices, analyze historical price trends, estimate profitability, and receive Sell/Hold/Monitor decision support.

```text
Discover → Plan → Grow → Monitor → Harvest → Sell
```

---

## 2. Current Project Status

| Area | Status | Notes |
| :--- | :--- | :--- |
| **Frontend** | `IMPLEMENTED` | Polished React + Tailwind dashboard with all 9 module views |
| **Backend** | `IMPLEMENTED` | Express REST API server with deterministic analysis services & health check |
| **Database** | `IMPLEMENTED` | MongoDB Atlas Mongoose models with seamless offline seed fallback |
| **Weather** | `IMPLEMENTED` | OpenWeatherMap live integration with 7-day forecast & offline fallback |
| **Market Data** | `IMPLEMENTED` | APMC mandi prices, inter-mandi spreads, and 30-day historical time-series |
| **Price Analysis** | `IMPLEMENTED` | 7d/30d SMA, volatility index, and trend categorization |
| **Crop Recommendation** | `IMPLEMENTED` | Deterministic multi-factor scoring (soil, season, water, profit) |
| **Sell/Hold/Monitor** | `IMPLEMENTED` | Quantitative decision-support engine with clear reasoning & disclaimer |
| **Profit Estimator** | `IMPLEMENTED` | Acreage, yield, gross revenue, itemized costs, ROI%, and break-even price |
| **AI Assistant** | `IMPLEMENTED` | Server-side Gemini/OpenAI proxy with grounded agronomy knowledge fallback |
| **Authentication** | `PLANNED` | Farmer session management / JWT |

---

## 3. Technology Stack

- **Frontend**: React.js (`^18/19`), Tailwind CSS (`^3.4`), React Router DOM, Lucide React, Recharts
- **Backend**: Node.js (`>=18 LTS`), Express.js (`^4.19`), Mongoose (`^8`)
- **Database**: MongoDB Atlas *(Tool: MongoDB Compass for inspection only)*
- **AI**: External AI API (Google Gemini / OpenAI via Express backend proxy)
- **External Services**: Weather API, Mandi Market Price API, Geolocation API

---

## 4. Architecture

```text
Farmer
  ↓
React + Tailwind (Client SPA)
  ↓ [REST API Calls / JSON]
Express REST API (Backend Server)
  ↓
Services Layer
  ├── cropMatchingService (Suitability scoring)
  ├── priceAnalysisService (SMA, volatility, trends)
  ├── decisionEngineService (Sell/Hold/Monitor logic)
  ├── externalWeatherService (Forecast caching)
  ├── externalMarketService (Mandi prices)
  └── aiAssistantService (Safe LLM prompts)
  ↓
MongoDB Atlas / External APIs / External AI API
```

> **CORE RULE**: The frontend communicates solely with the Express backend. Secrets and AI API keys must **NEVER** be exposed to React or client bundles.

---

## 5. Important Directories

```text
/frontend                      # React client application root
  ├── src/pages                # Route views (Dashboard, Crops, Markets, AI)
  ├── src/components           # Reusable UI components
  └── src/services             # Frontend API client modules (api.js, etc.)

/backend                       # Express REST API root
  ├── src/routes               # API route definitions
  ├── src/controllers          # HTTP request handlers
  ├── src/services             # Deterministic business & analysis logic
  ├── src/models               # Mongoose database schemas
  └── src/config               # Database & environment configuration

/docs                          # AI project documentation & memory
  ├── AI_QUICKSTART.md         # This fast-navigation summary (100–200 lines)
  └── PROJECT_CONTEXT.md       # Comprehensive system specification & source of truth
```

---

## 6. Critical Files

| File | Purpose |
| :--- | :--- |
| `frontend/src/App.jsx` | Client routing and shell layout |
| `frontend/src/index.css` | Design tokens, color system, and Tailwind directives |
| `backend/src/server.js` | Express entry point, DB connection, and server startup |
| `backend/src/app.js` | Express middleware, CORS, rate limits, and route mounting |
| `backend/src/config/db.js` | MongoDB Atlas Mongoose connection handler |
| `backend/src/services/cropMatchingService.js` | Soil/weather/profit crop suitability scoring |
| `backend/src/services/priceAnalysisService.js` | 7d/30d moving averages and price volatility |
| `backend/src/services/decisionEngineService.js` | Sell / Hold / Monitor decision logic |
| `backend/src/services/aiAssistantService.js` | Backend LLM prompt formatting & safe proxy |
| `backend/src/services/externalWeatherService.js` | Weather API fetching and 30-min caching |
| `backend/src/services/externalMarketService.js` | Mandi market price queries & fallbacks |
| `docs/PROJECT_CONTEXT.md` | Full architecture, schema, API registry, and ADRs |

---

## 7. API Quick Reference

> *Currently all endpoints are **`PLANNED`**. Scaffolding will implement these routes:*

- `GET  /api/health` — Service health & DB status check
- `GET  /api/crops` / `GET /api/crops/:id` — Crop catalogue and cultivation profiles
- `POST /api/crops/recommend` — Crop suitability recommendations
- `GET  /api/crops/fertilizers` — Fertilizer guides (chemical & organic)
- `GET  /api/markets` — Nearby APMC mandis sorted by distance
- `GET  /api/markets/prices/current` — Current commodity rates across mandis
- `GET  /api/markets/prices/:cropId/history` — 30-day price time-series data
- `GET  /api/markets/prices/:cropId/analysis` — 7d/30d SMA, % change, and volatility
- `POST /api/decisions/sell-hold` — Sell / Hold / Monitor recommendation
- `GET  /api/weather` — Local current weather & 7-day forecast
- `POST /api/profit/calculate` — Revenue and profit estimator
- `POST /api/ai/ask` — Grounded AI farming explanations (Gemini/OpenAI/Fallback)

*See [PROJECT_CONTEXT.md#8-api-documentation](file:///c:/Users/PC/Desktop/Hackathon/docs/PROJECT_CONTEXT.md#8-api-documentation) for request/response payloads.*

---

## 8. Database Quick Reference (MongoDB Atlas)

- `crops`: Cultivation guides, NPK needs, climate bounds, yield stats
- `fertilizers`: Chemical & organic specifications, dosages, application stages
- `markets`: APMC Mandi metadata with GeoJSON 2dsphere coordinates
- `price_records`: Daily commodity prices (min, max, modal) with compound index
- `recommendations`: Audit log of decisions served to farmers

---

## 9. Core Business Logic

- **Crop Matching**: Score = $(0.35 \times \text{Soil}) + (0.35 \times \text{Weather}) + (0.30 \times \text{Profit})$.
- **Price Analysis**: $SMA_7$, $SMA_{30}$, % Price Change, Relative Volatility Index $\sigma / \bar{P}$.
- **Sell / Hold / Monitor Decision**:
  - `SELL`: Price $\ge 1.10 \times SMA_{30}$ and momentum flattening, OR severe rain risk / shelf-life limit.
  - `HOLD`: Price in upward momentum ($\Delta P_{7d} > +3\%$) with low storage loss risk.
  - `MONITOR`: Price within $\pm 3\%$ of 30-day baseline or low trade volume.

---

## 10. AI Integration

```text
Frontend (React) ──POST──> Express (/api/ai/*) ──> aiAssistantService ──> External AI API
```

- **Rule 1**: AI is called **only** via Express backend proxy; never from the browser.
- **Rule 2**: Core math, price trends, and sell/hold decisions are computed **deterministically** by backend services; the LLM **only** generates plain-language, contextual explanations.
- **Rule 3**: Rate limiting and fact grounding are strictly enforced on the server.

---

## 11. Environment Variables

*Names only — never expose secret values:*

- `PORT`: Express server port (Default: `5000`)
- `MONGODB_URI`: MongoDB Atlas connection string (Used in `backend/src/config/db.js`)
- `CLIENT_URL`: Allowed CORS origin for frontend (Default: `http://localhost:5173`)
- `AI_API_KEY`: External LLM API credentials (Used in `aiAssistantService.js`)
- `WEATHER_API_KEY`: Weather provider key (Used in `externalWeatherService.js`)
- `MARKET_API_KEY`: Mandi market API key (Used in `externalMarketService.js`)
- `JWT_SECRET`: Farmer authentication secret (Used in `middleware/auth.js`)

---

## 12. Currently Important Variables / Constants

- `PRICE_VOLATILITY_THRESHOLD` $\rightarrow$ `decisionEngineService.js` $\rightarrow$ Volatility cut-off (0.15)
- `PRICE_MOMENTUM_THRESHOLD` $\rightarrow$ `decisionEngineService.js` $\rightarrow$ 7-day rate of change (+0.05)
- `HOLD_STORAGE_MAX_DAYS` $\rightarrow$ `decisionEngineService.js` $\rightarrow$ Perishability ceiling (14 days)
- `WEATHER_CACHE_DURATION` $\rightarrow$ `externalWeatherService.js` $\rightarrow$ API cache lifetime (30 min)

---

## 13. Known Critical Issues

- `[OPEN] ISSUE-001`: Workspace initialized with fresh empty git repository. No application source files created yet. Scaffolding task next.

---

## 14. Current Development Focus

- **Current Milestone**: Milestone 1 — Core End-to-End Platform Implementation
- **Current Feature**: Complete Frontend & Backend Integration
- **Currently Modified Area**: `/backend` & `/frontend`
- **Last Completed Feature**: Built full React client UI with 9 tabs, Express API, deterministic services, and seed data
- **Next Logical Task**: Real user testing, production database cluster seeding, and live API key testing

---

## 15. Recent Changes

1. Inspected git repo (`AgroMate`) and established baseline docs (`PROJECT_CONTEXT.md`, `AI_QUICKSTART.md`).
2. Implemented Express REST API foundation with health check, CORS, and hybrid Atlas / offline seed data persistence.
3. Implemented deterministic backend services for Crop Matching, Price Analysis (SMA/volatility), Decision Engine (Sell/Hold/Monitor), Profit Estimator, Weather, and AI proxy.
4. Built complete, responsive React + Tailwind frontend dashboard with all 9 core feature views.
5. Created root and project level run scripts in `package.json` for one-command execution.

---

## 16. AI Handoff Procedure

```text
WHEN TAKING OVER THIS PROJECT:

1. Read this AI_QUICKSTART.md first.
2. Identify the feature or area that needs modification.
3. Read the relevant section of PROJECT_CONTEXT.md.
4. Identify the exact files involved.
5. Read only those files unless additional context is required.
6. Check recent changes and known issues.
7. Make the smallest appropriate change.
8. Test the affected functionality.
9. Update PROJECT_CONTEXT.md.
10. Update AI_QUICKSTART.md if the project state or important architecture changed.
11. Record the change in the change log.
```

---

## 17. Important Rules for Future AI Agents

### DO:
- Read `AI_QUICKSTART.md` first.
- Use `PROJECT_CONTEXT.md` to locate relevant files before opening them.
- Inspect actual code before modifying it.
- Preserve existing architecture unless there is a clear ADR reason.
- Keep frontend and backend responsibilities separated.
- Keep secrets on the backend.
- Update project documentation after meaningful changes.
- Prefer small, targeted changes.

### DO NOT:
- Read the entire repository unnecessarily.
- Assume planned features are implemented.
- Put API keys in frontend code.
- Directly connect React to MongoDB.
- Duplicate backend business logic in React.
- Delete historical documentation.
- Treat AI output as authoritative for deterministic calculations.

---

## 18. Relationship With PROJECT_CONTEXT.md

```text
AI_QUICKSTART.md
    ↓ (Fast project orientation)
PROJECT_CONTEXT.md
    ↓ (Detailed technical context & schemas)
Actual source code
    ↓ (Ultimate implementation truth)
```

> If `AI_QUICKSTART.md` and `PROJECT_CONTEXT.md` disagree, inspect the actual source code, determine the current implementation, and update both documentation files.

---

## 19. Maintenance Rule

```text
Code Change
    ↓
Update PROJECT_CONTEXT.md
    ↓
Does this affect quickstart information?
    ↓
YES → Update AI_QUICKSTART.md
NO  → Leave quickstart unchanged
```
