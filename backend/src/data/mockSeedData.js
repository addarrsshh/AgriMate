// Mock Seed Data for AgriMate - Indian Agricultural Ecosystem

const crops = [
  {
    id: "crop-wheat",
    name: "Wheat (Kalyan Sona / HD-2967)",
    scientificName: "Triticum aestivum",
    category: "Cereal",
    suitableSeasons: ["Rabi"],
    soilSuitability: ["Alluvial", "Loamy", "Clayey"],
    waterRequirement: "Medium (450 - 650 mm)",
    waterRequirementLevel: "Medium",
    idealTempCelsius: { min: 10, max: 25 },
    durationDays: { min: 120, max: 140 },
    averageYieldPerAcreKg: 1800,
    cultivationCostPerAcre: 15500,
    currentModalPricePerQuintal: 2450,
    mspPerQuintal: 2275,
    shelfLifeDays: 180,
    stages: [
      { name: "Crown Root Initiation (CRI)", daysAfterSowing: "20-25 days", waterNeeded: "Crucial first irrigation", action: "Apply 1st dose Nitrogen top-dressing" },
      { name: "Tillering Stage", daysAfterSowing: "40-45 days", waterNeeded: "Second irrigation", action: "Weed removal and hoeing" },
      { name: "Jointing & Booting", daysAfterSowing: "60-70 days", waterNeeded: "Third irrigation", action: "Check for yellow rust or aphid infestation" },
      { name: "Flowering & Milking", daysAfterSowing: "85-95 days", waterNeeded: "Critical grain-filling irrigation", action: "Avoid irrigation during strong winds" },
      { name: "Maturity & Harvest", daysAfterSowing: "120-135 days", waterNeeded: "Stop irrigation 10 days before harvest", action: "Harvest when moisture is 12-14%" }
    ],
    fertilizerRecommendation: {
      npkRatioKgPerAcre: { n: 50, p: 25, k: 15 },
      conventionalPlan: "Basal: 50kg DAP + 25kg MOP per acre. Top dress: 45kg Urea at 21 days & 45kg Urea at 45 days.",
      organicPlan: "10 tonnes FYM/Compost at land preparation + 5kg Azotobacter & PSB bio-fertilizers per acre. Foliar spray of Jeevamrit at 30 & 60 days."
    },
    pestManagement: "Watch for Yellow Rust (Puccinia striiformis). Use Propiconazole 25% EC @ 1ml/L or Neem oil 1500ppm spray preventively."
  },
  {
    id: "crop-paddy",
    name: "Paddy / Rice (Pusa Basmati 1121)",
    scientificName: "Oryza sativa",
    category: "Cereal",
    suitableSeasons: ["Kharif"],
    soilSuitability: ["Clayey", "Loamy", "Alluvial"],
    waterRequirement: "High (1200 - 1800 mm)",
    waterRequirementLevel: "High",
    idealTempCelsius: { min: 20, max: 36 },
    durationDays: { min: 135, max: 150 },
    averageYieldPerAcreKg: 1900,
    cultivationCostPerAcre: 21000,
    currentModalPricePerQuintal: 3850,
    mspPerQuintal: 2203,
    shelfLifeDays: 240,
    stages: [
      { name: "Nursery & Transplanting", daysAfterSowing: "20-25 days", waterNeeded: "Standing water 2-3 cm", action: "Transplant 2-3 seedlings per hill" },
      { name: "Tillering Stage", daysAfterSowing: "30-45 days", waterNeeded: "Submerged 3-5 cm", action: "Apply zinc sulphate and 1st urea top-dress" },
      { name: "Panicle Initiation", daysAfterSowing: "65-75 days", waterNeeded: "Keep saturated", action: "Inspect for stem borer and leaf folder" },
      { name: "Flowering & Grain Filling", daysAfterSowing: "90-110 days", waterNeeded: "5 cm standing water", action: "Monitor for blast disease" },
      { name: "Ripening & Harvesting", daysAfterSowing: "135-145 days", waterNeeded: "Drain water 10 days before harvest", action: "Combine or manual harvest at golden hue" }
    ],
    fertilizerRecommendation: {
      npkRatioKgPerAcre: { n: 48, p: 24, k: 24 },
      conventionalPlan: "Basal: 55kg DAP + 40kg MOP + 10kg Zinc Sulphate (21%). Top dress Urea in 2 splits.",
      organicPlan: "8 tonnes Vermicompost + Blue Green Algae (BGA) bio-fertilizer + Azospirillum culture."
    },
    pestManagement: "Stem borer and Brown Planthopper (BPH). Install pheromone traps (5/acre) and spray Neem seed kernel extract (NSKE 5%)."
  },
  {
    id: "crop-cotton",
    name: "Bt Cotton (RCH-659 BG II)",
    scientificName: "Gossypium hirsutum",
    category: "CashCrop",
    suitableSeasons: ["Kharif"],
    soilSuitability: ["Black", "Deep Alluvial"],
    waterRequirement: "Medium (600 - 800 mm)",
    waterRequirementLevel: "Medium",
    idealTempCelsius: { min: 21, max: 35 },
    durationDays: { min: 150, max: 180 },
    averageYieldPerAcreKg: 950,
    cultivationCostPerAcre: 24000,
    currentModalPricePerQuintal: 7150,
    mspPerQuintal: 7020,
    shelfLifeDays: 120,
    stages: [
      { name: "Germination & Square Formation", daysAfterSowing: "35-45 days", waterNeeded: "Avoid waterlogging", action: "Intercultural weeding & thinning" },
      { name: "Flowering & Boll Formation", daysAfterSowing: "70-90 days", waterNeeded: "Critical irrigation", action: "Monitor pink bollworm through delta traps" },
      { name: "Boll Maturation & Bursting", daysAfterSowing: "120-150 days", waterNeeded: "Dry weather preferred", action: "First picking of clean, dry bolls" }
    ],
    fertilizerRecommendation: {
      npkRatioKgPerAcre: { n: 60, p: 30, k: 30 },
      conventionalPlan: "Basal: 65kg DAP + 50kg MOP. Top dress Urea in 3 equal splits at 30, 60, and 90 DAS.",
      organicPlan: "Castor cake 500kg/acre + Trichoderma viride enriched FYM 5 tonnes."
    },
    pestManagement: "Pink Bollworm and sucking pests (Whitefly, Thrips). Yellow sticky traps (10/acre) + Flonicamid or Neem oil."
  },
  {
    id: "crop-mustard",
    name: "Mustard / Rapeseed (Pusa Jai Kisan)",
    scientificName: "Brassica juncea",
    category: "Oilseed",
    suitableSeasons: ["Rabi"],
    soilSuitability: ["Loamy", "Sandy Loam", "Alluvial"],
    waterRequirement: "Low (250 - 400 mm)",
    waterRequirementLevel: "Low",
    idealTempCelsius: { min: 10, max: 25 },
    durationDays: { min: 105, max: 125 },
    averageYieldPerAcreKg: 850,
    cultivationCostPerAcre: 11000,
    currentModalPricePerQuintal: 5450,
    mspPerQuintal: 5650,
    shelfLifeDays: 200,
    stages: [
      { name: "Vegetative & Branching", daysAfterSowing: "25-30 days", waterNeeded: "First irrigation at pre-flowering", action: "Thinning to maintain 10-15 cm spacing" },
      { name: "Flowering & Pod Formation", daysAfterSowing: "50-60 days", waterNeeded: "Second irrigation at pod filling", action: "Watch out for aphids (Cabbage aphid)" },
      { name: "Pod Maturity & Harvest", daysAfterSowing: "105-120 days", waterNeeded: "Dry sunny period", action: "Harvest when 75% siliquae turn golden yellow" }
    ],
    fertilizerRecommendation: {
      npkRatioKgPerAcre: { n: 32, p: 16, k: 16 },
      conventionalPlan: "Basal: 35kg DAP + 25kg MOP + 15kg Bentonite Sulphur (vital for oil content). Top dress Urea at 30 DAS.",
      organicPlan: "4 tonnes FYM + 200kg Neem cake (soil nematicide + nitrogen slow release)."
    },
    pestManagement: "Mustard Aphids: Spray Thiamethoxam 25 WG @ 0.2g/L or Dashparni Ark organically."
  },
  {
    id: "crop-chickpea",
    name: "Chickpea / Bengal Gram (JG-11 / Desi Chana)",
    scientificName: "Cicer arietinum",
    category: "Pulse",
    suitableSeasons: ["Rabi"],
    soilSuitability: ["Black", "Loamy", "Clayey"],
    waterRequirement: "Low (200 - 350 mm)",
    waterRequirementLevel: "Low",
    idealTempCelsius: { min: 12, max: 26 },
    durationDays: { min: 100, max: 115 },
    averageYieldPerAcreKg: 750,
    cultivationCostPerAcre: 10500,
    currentModalPricePerQuintal: 5850,
    mspPerQuintal: 5440,
    shelfLifeDays: 210,
    stages: [
      { name: "Branching & Nipping", daysAfterSowing: "30-35 days", waterNeeded: "Single branching irrigation", action: "Nipping terminal buds to boost secondary branching" },
      { name: "Podding Stage", daysAfterSowing: "60-70 days", waterNeeded: "Avoid water logging", action: "Install Helicoverpa pheromone traps" },
      { name: "Maturity", daysAfterSowing: "100-110 days", waterNeeded: "Dry ripening", action: "Cut when leaves turn straw yellow" }
    ],
    fertilizerRecommendation: {
      npkRatioKgPerAcre: { n: 10, p: 25, k: 10 },
      conventionalPlan: "Basal: 50kg DAP + 15kg MOP. Being a legume, it fixes its own atmospheric nitrogen.",
      organicPlan: "Rhizobium leguminosarum seed coating + 5 tonnes compost."
    },
    pestManagement: "Pod borer (Helicoverpa armigera). Spray HaNPV 250 LE/ha or Bacillus thuringiensis (Bt) kurstaki."
  },
  {
    id: "crop-maize",
    name: "Maize / Corn (Pioneer P3396 / Sweet Corn)",
    scientificName: "Zea mays",
    category: "Cereal",
    suitableSeasons: ["Kharif", "Rabi", "Zaid"],
    soilSuitability: ["Loamy", "Alluvial", "Red"],
    waterRequirement: "Medium (500 - 700 mm)",
    waterRequirementLevel: "Medium",
    idealTempCelsius: { min: 18, max: 32 },
    durationDays: { min: 95, max: 110 },
    averageYieldPerAcreKg: 2400,
    cultivationCostPerAcre: 16000,
    currentModalPricePerQuintal: 2150,
    mspPerQuintal: 2090,
    shelfLifeDays: 90,
    stages: [
      { name: "Knee-High Stage", daysAfterSowing: "25-30 days", waterNeeded: "Irrigate every 10 days", action: "Top dress urea and scout for Fall Armyworm (FAW)" },
      { name: "Tasseling & Silking", daysAfterSowing: "50-60 days", waterNeeded: "Most critical moisture period", action: "Ensure no drought stress during pollination" },
      { name: "Grain Filling & Harvest", daysAfterSowing: "85-100 days", waterNeeded: "Moderate moisture", action: "Harvest when cob sheaths turn papery dry" }
    ],
    fertilizerRecommendation: {
      npkRatioKgPerAcre: { n: 48, p: 24, k: 20 },
      conventionalPlan: "Basal: 50kg DAP + 35kg MOP. Top dress Urea in 2 splits (knee-high and pre-tassel).",
      organicPlan: "6 tonnes enriched compost + vermiwash spray at vegetative phase."
    },
    pestManagement: "Fall Armyworm (Spodoptera frugiperda). Apply Spinetoram 11.7 SC @ 0.5ml/L or release Trichogramma egg parasitoids."
  },
  {
    id: "crop-soybean",
    name: "Soybean (JS-335 / JS-9560)",
    scientificName: "Glycine max",
    category: "Oilseed",
    suitableSeasons: ["Kharif"],
    soilSuitability: ["Black", "Deep Loamy"],
    waterRequirement: "Medium (450 - 650 mm)",
    waterRequirementLevel: "Medium",
    idealTempCelsius: { min: 20, max: 30 },
    durationDays: { min: 90, max: 105 },
    averageYieldPerAcreKg: 850,
    cultivationCostPerAcre: 12500,
    currentModalPricePerQuintal: 4620,
    mspPerQuintal: 4600,
    shelfLifeDays: 150,
    stages: [
      { name: "Vegetative Phase", daysAfterSowing: "20-25 days", waterNeeded: "Well drained soil", action: "Interculture weed removal" },
      { name: "Flowering & Podding", daysAfterSowing: "45-60 days", waterNeeded: "Critical moisture sensitivity", action: "Foliar spray of 00:52:34 (MKP) for pod weight" },
      { name: "Maturity", daysAfterSowing: "90-100 days", waterNeeded: "Dry sunny period", action: "Harvest promptly to prevent pod shattering" }
    ],
    fertilizerRecommendation: {
      npkRatioKgPerAcre: { n: 12, p: 32, k: 16 },
      conventionalPlan: "Basal: Single Super Phosphate (SSP) 150kg (provides phosphorus + 11% sulphur) + 25kg MOP.",
      organicPlan: "Bradyrhizobium japonicum inoculation + 5 tonnes FYM per acre."
    },
    pestManagement: "Girdle beetle and semilooper. Spray Chlorantraniliprole 18.5 SC @ 0.3ml/L."
  },
  {
    id: "crop-potato",
    name: "Potato (Kufri Pukhraj / Jyoti)",
    scientificName: "Solanum tuberosum",
    category: "Vegetable",
    suitableSeasons: ["Rabi"],
    soilSuitability: ["Sandy Loam", "Alluvial", "Loamy"],
    waterRequirement: "Medium (400 - 550 mm)",
    waterRequirementLevel: "Medium",
    idealTempCelsius: { min: 14, max: 22 },
    durationDays: { min: 80, max: 100 },
    averageYieldPerAcreKg: 10500,
    cultivationCostPerAcre: 42000,
    currentModalPricePerQuintal: 1480,
    mspPerQuintal: null,
    shelfLifeDays: 60,
    stages: [
      { name: "Sprouting & Stolon Formation", daysAfterSowing: "20-25 days", waterNeeded: "Light frequent irrigation", action: "Earthing up soil to cover growing tubers" },
      { name: "Tuber Bulking Stage", daysAfterSowing: "45-65 days", waterNeeded: "Even moisture, avoid excess", action: "Inspect for Early & Late Blight disease" },
      { name: "Dehaulming & Harvest", daysAfterSowing: "80-90 days", waterNeeded: "Stop water 12 days prior", action: "Cut foliage 10 days before digging to cure skin" }
    ],
    fertilizerRecommendation: {
      npkRatioKgPerAcre: { n: 60, p: 40, k: 50 },
      conventionalPlan: "Basal: 85kg DAP + 80kg MOP. Top dress Urea in 2 splits before earthing-up.",
      organicPlan: "12 tonnes well-rotted cow manure + bio-potash foliar applications."
    },
    pestManagement: "Late Blight (Phytophthora infestans). Mancozeb 75 WP @ 2.5g/L preventive or Cymoxanil+Mancozeb curative."
  },
  {
    id: "crop-onion",
    name: "Onion (Nashik Red / Bhima Super)",
    scientificName: "Allium cepa",
    category: "Vegetable",
    suitableSeasons: ["Rabi", "Kharif"],
    soilSuitability: ["Sandy Loam", "Alluvial", "Clay Loam"],
    waterRequirement: "Medium (350 - 550 mm)",
    waterRequirementLevel: "Medium",
    idealTempCelsius: { min: 13, max: 28 },
    durationDays: { min: 110, max: 130 },
    averageYieldPerAcreKg: 8000,
    cultivationCostPerAcre: 38000,
    currentModalPricePerQuintal: 2150,
    mspPerQuintal: null,
    shelfLifeDays: 75,
    stages: [
      { name: "Transplanting & Establishment", daysAfterSowing: "30-40 days", waterNeeded: "Immediate light irrigation", action: "Ensure 10x15 cm spacing on raised beds" },
      { name: "Bulb Development", daysAfterSowing: "65-90 days", waterNeeded: "Regular moisture, avoid stress", action: "Control thrips to prevent purple blotch" },
      { name: "Neck Fall & Curing", daysAfterSowing: "115-125 days", waterNeeded: "Withhold water 15 days before harvest", action: "Field cure under shade for 4-5 days" }
    ],
    fertilizerRecommendation: {
      npkRatioKgPerAcre: { n: 40, p: 20, k: 25 },
      conventionalPlan: "Basal: 45kg DAP + 40kg MOP + 15kg Sulphur. Top dress Urea in 2 splits.",
      organicPlan: "10 tonnes Vermicompost + Azospirillum & VAM (Mycorrhiza)."
    },
    pestManagement: "Thrips tabaci: Spray Spinosad 45 SC @ 0.3ml/L or Neem oil 3000ppm + sticky blue traps."
  },
  {
    id: "crop-tomato",
    name: "Tomato (Abhinav / Himsona)",
    scientificName: "Solanum lycopersicum",
    category: "Vegetable",
    suitableSeasons: ["Rabi", "Kharif", "Zaid"],
    soilSuitability: ["Loamy", "Red", "Black"],
    waterRequirement: "Medium (400 - 600 mm)",
    waterRequirementLevel: "Medium",
    idealTempCelsius: { min: 18, max: 30 },
    durationDays: { min: 100, max: 120 },
    averageYieldPerAcreKg: 14000,
    cultivationCostPerAcre: 48000,
    currentModalPricePerQuintal: 1850,
    mspPerQuintal: null,
    shelfLifeDays: 14,
    stages: [
      { name: "Transplanting & Staking", daysAfterSowing: "25-30 days", waterNeeded: "Drip irrigation ideal", action: "Tying plants to bamboo stakes or trellises" },
      { name: "Flowering & Fruit Set", daysAfterSowing: "50-70 days", waterNeeded: "Consistent moisture to stop blossom end rot", action: "Calcium nitrate spray (1g/L)" },
      { name: "Harvesting Flushes", daysAfterSowing: "80-120 days", waterNeeded: "Light regular water", action: "Pick at breaker/pink stage for transport" }
    ],
    fertilizerRecommendation: {
      npkRatioKgPerAcre: { n: 60, p: 30, k: 40 },
      conventionalPlan: "Basal: 65kg DAP + 65kg MOP. Fertigation via drip with 19:19:19 and 13:00:45.",
      organicPlan: "8 tonnes FYM + Panchagavya 3% foliar spray every 15 days."
    },
    pestManagement: "Tomato Fruit Borer (Tuta absoluta / Helicoverpa). Spray Coragen 18.5 SC @ 0.3ml/L."
  }
];

const markets = [
  {
    id: "mkt-kozhikode",
    name: "Kozhikode APMC / Palayam Market",
    state: "Kerala",
    district: "Kozhikode",
    distanceKm: 6,
    tradingVolumeTonsPerDay: 420,
    latitude: 11.248,
    longitude: 75.7804,
    contactNumber: "+91-495-2720101",
    speciality: "Coconut, Spices, Banana, Paddy, Vegetables"
  },
  {
    id: "mkt-manjeri",
    name: "Manjeri Wholesale Agri Market",
    state: "Kerala",
    district: "Malappuram",
    distanceKm: 48,
    tradingVolumeTonsPerDay: 580,
    latitude: 11.1202,
    longitude: 76.1206,
    contactNumber: "+91-483-2766205",
    speciality: "Banana, Coconut, Arecanut, Spices"
  },
  {
    id: "mkt-kalpetta",
    name: "Kalpetta Farmers Market Yard",
    state: "Kerala",
    district: "Wayanad",
    distanceKm: 72,
    tradingVolumeTonsPerDay: 390,
    latitude: 11.6103,
    longitude: 76.0827,
    contactNumber: "+91-4936-202450",
    speciality: "Black Pepper, Coffee, Ginger, Cardamom"
  },
  {
    id: "mkt-kannur",
    name: "Kannur APMC Market Yard",
    state: "Kerala",
    district: "Kannur",
    distanceKm: 92,
    tradingVolumeTonsPerDay: 450,
    latitude: 11.8745,
    longitude: 75.3704,
    contactNumber: "+91-497-2705800",
    speciality: "Coconut, Cashew, Paddy, Banana"
  },
  {
    id: "mkt-thrissur",
    name: "Sakthan Thampuran Wholesale Market",
    state: "Kerala",
    district: "Thrissur",
    distanceKm: 115,
    tradingVolumeTonsPerDay: 680,
    latitude: 10.5276,
    longitude: 76.2144,
    contactNumber: "+91-487-2428900",
    speciality: "Nendran Banana, Vegetables, Rice, Coconut"
  },
  {
    id: "mkt-palakkad",
    name: "Palakkad Big Bazaar & Grain Mandi",
    state: "Kerala",
    district: "Palakkad",
    distanceKm: 125,
    tradingVolumeTonsPerDay: 750,
    latitude: 10.7867,
    longitude: 76.6548,
    contactNumber: "+91-491-2534120",
    speciality: "Paddy, Pulses, Groundnut, Vegetables"
  }
];

// Helper to generate 30 days of realistic daily price history
const generatePriceHistory = (basePrice, volatilityPct = 0.03, trendDirection = 'up') => {
  const history = [];
  const today = new Date();
  
  let price = basePrice;
  // Compute prices backward from 30 days ago to today
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Seeded random walk
    const trendFactor = trendDirection === 'up' ? 0.002 : trendDirection === 'down' ? -0.0025 : 0;
    const dayRandom = (Math.sin(i * 1.5) * 0.5 + Math.cos(i * 0.8) * 0.5) * volatilityPct;
    price = Math.round(price * (1 + trendFactor + dayRandom));

    const minPrice = Math.round(price * 0.95);
    const maxPrice = Math.round(price * 1.05);
    const volume = Math.round(150 + Math.abs(Math.sin(i) * 120));

    history.push({
      date: dateStr,
      modalPrice: price,
      minPrice,
      maxPrice,
      volumeTons: volume
    });
  }
  return history;
};

// Map each crop to simulated 30-day market prices
const historicalPricesByCrop = {
  "crop-wheat": generatePriceHistory(2450, 0.02, 'up'),
  "crop-paddy": generatePriceHistory(3850, 0.035, 'up'),
  "crop-cotton": generatePriceHistory(7150, 0.04, 'stable'),
  "crop-mustard": generatePriceHistory(5450, 0.025, 'down'),
  "crop-chickpea": generatePriceHistory(5850, 0.028, 'up'),
  "crop-maize": generatePriceHistory(2150, 0.02, 'stable'),
  "crop-soybean": generatePriceHistory(4620, 0.03, 'down'),
  "crop-potato": generatePriceHistory(1480, 0.06, 'down'),
  "crop-onion": generatePriceHistory(2150, 0.07, 'up'),
  "crop-tomato": generatePriceHistory(1850, 0.09, 'stable')
};

const fertilizers = [
  {
    id: "fert-urea",
    name: "Neem Coated Urea (46% N)",
    type: "Chemical",
    npk: "46:00:00",
    bagSizeKg: 45,
    subsidizedRatePerBag: 266.5,
    commercialRatePerBag: 350,
    applicationStage: "Basal & Top Dressing (Splits at 21 & 45 days)",
    organic: false,
    benefits: "Primary nitrogen source promoting leafy growth, shoot vigor, and tillering.",
    precautions: "Do not apply during heavy rain or standing stagnant water to prevent leaching."
  },
  {
    id: "fert-dap",
    name: "Di-Ammonium Phosphate (DAP)",
    type: "Chemical",
    npk: "18:46:00",
    bagSizeKg: 50,
    subsidizedRatePerBag: 1350,
    commercialRatePerBag: 1600,
    applicationStage: "Basal application at sowing time",
    organic: false,
    benefits: "Essential for vigorous root development, early seedling strength, and tillering.",
    precautions: "Must be placed 3-5 cm below and away from seed line to avoid seedling burn."
  },
  {
    id: "fert-mop",
    name: "Muriate of Potash (MOP)",
    type: "Chemical",
    npk: "00:00:60",
    bagSizeKg: 50,
    subsidizedRatePerBag: 1650,
    commercialRatePerBag: 1950,
    applicationStage: "Basal application and pre-flowering",
    organic: false,
    benefits: "Enhances drought tolerance, disease resistance, grain plumpness, and shelf life.",
    precautions: "Avoid excessive application on chloride-sensitive crops like tobacco and potato."
  },
  {
    id: "fert-vermicompost",
    name: "Premium Vermicompost (Earthworm Castings)",
    type: "Organic",
    npk: "1.5:1.0:1.5 + Micronutrients",
    bagSizeKg: 50,
    subsidizedRatePerBag: 300,
    commercialRatePerBag: 350,
    applicationStage: "Soil preparation & active vegetative stage",
    organic: true,
    benefits: "Improves soil organic carbon (SOC), water-holding capacity, and beneficial soil microbes.",
    precautions: "Store in cool shade; avoid direct drying sunlight which kills earthworm cocoons."
  },
  {
    id: "fert-neem-cake",
    name: "De-oiled Neem Cake Organic Manure",
    type: "Organic",
    npk: "5.2:1.0:1.4",
    bagSizeKg: 50,
    subsidizedRatePerBag: 750,
    commercialRatePerBag: 850,
    applicationStage: "Basal soil incorporation 10 days before sowing",
    organic: true,
    benefits: "Natural nitrification inhibitor; controls root-knot nematodes and white grubs.",
    precautions: "Mix thoroughly into top 15cm of soil."
  },
  {
    id: "fert-bio-npk",
    name: "Liquid Bio-NPK Consortium (Azotobacter + PSB + KMB)",
    type: "Biofertilizer",
    npk: "Microbial inoculant",
    bagSizeKg: 1, // 1 Litre
    subsidizedRatePerBag: 180,
    commercialRatePerBag: 250,
    applicationStage: "Seed treatment or drip irrigation",
    organic: true,
    benefits: "Fixes atmospheric nitrogen and solubilizes fixed phosphorus and potassium in soil.",
    precautions: "Do not mix directly with chemical fungicides or insecticides."
  }
];

const defaultWeather = {
  location: "Kozhikode, Kerala",
  coordinates: { lat: 11.248, lng: 75.7804 },
  current: {
    tempCelsius: 24,
    condition: "Partly Cloudy",
    humidityPct: 62,
    windSpeedKmh: 12,
    rainfallChancePct: 15,
    uvIndex: 6,
    soilTempCelsius: 21,
    evapotranspirationMm: 3.8
  },
  forecast7Day: [
    { day: "Today", date: "Day 1", tempMax: 27, tempMin: 16, condition: "Partly Cloudy", rainMm: 0, sprayRisk: "Low (Safe to spray)" },
    { day: "Tomorrow", date: "Day 2", tempMax: 28, tempMin: 17, condition: "Sunny", rainMm: 0, sprayRisk: "Low (Ideal spraying window)" },
    { day: "Day 3", date: "Day 3", tempMax: 26, tempMin: 18, condition: "Scattered Clouds", rainMm: 2, sprayRisk: "Moderate (Check wind speed)" },
    { day: "Day 4", date: "Day 4", tempMax: 24, tempMin: 16, condition: "Light Rain", rainMm: 12, sprayRisk: "High (Avoid spraying pesticides)" },
    { day: "Day 5", date: "Day 5", tempMax: 25, tempMin: 15, condition: "Clear", rainMm: 0, sprayRisk: "Low (Safe to irrigate/spray)" },
    { day: "Day 6", date: "Day 6", tempMax: 27, tempMin: 17, condition: "Sunny", rainMm: 0, sprayRisk: "Low" },
    { day: "Day 7", date: "Day 7", tempMax: 28, tempMin: 18, condition: "Sunny", rainMm: 0, sprayRisk: "Low" }
  ],
  agroAdvisories: [
    {
      category: "Wheat",
      advice: "Weather is conducive for vegetative growth. Ensure 1st irrigation (CRI stage) if sown 20 days ago."
    },
    {
      category: "Mustard",
      advice: "Sunny hours are favorable for aphid proliferation. Inspect underside of leaves and set sticky yellow traps."
    },
    {
      category: "Vegetables",
      advice: "Light rain expected on Day 4. Complete any foliar fertilizer or pest sprays within the next 48 hours."
    }
  ]
};

module.exports = {
  crops,
  markets,
  historicalPricesByCrop,
  fertilizers,
  defaultWeather
};
