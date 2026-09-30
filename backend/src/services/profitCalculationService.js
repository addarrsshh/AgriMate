const { getCropById } = require('./dataAccessService');

/**
 * Profit Calculation Service
 * 
 * Computes:
 * - Gross Revenue = Total Production (Quintals) * Price per Quintal
 * - Cost of Cultivation = Base operational + Seed/Fertilizers + Labor + Transport + Miscellaneous
 * - Net Profit = Gross Revenue - Total Expenses
 * - Return on Investment (ROI %) = (Net Profit / Total Expenses) * 100
 * - Break-even Selling Price = Total Expenses / Total Production (Quintals)
 */

const calculateProfit = async (inputs) => {
  const {
    cropId,
    acreage = 1,
    customYieldKgPerAcre = null,
    customPricePerQuintal = null,
    seedCost = null,
    fertilizerCost = null,
    laborCost = null,
    irrigationCost = null,
    machineryCost = null,
    transportCostPerQuintal = 35,
    otherCost = null
  } = inputs;

  const crop = cropId ? await getCropById(cropId) : null;

  // Use provided inputs or sensible defaults from crop profile
  const yieldPerAcreKg = customYieldKgPerAcre !== null && customYieldKgPerAcre !== undefined
    ? Number(customYieldKgPerAcre)
    : (crop ? crop.averageYieldPerAcreKg : 1500);

  const pricePerQuintal = customPricePerQuintal !== null && customPricePerQuintal !== undefined
    ? Number(customPricePerQuintal)
    : (crop ? crop.currentModalPricePerQuintal : 2200);

  const totalYieldKg = yieldPerAcreKg * acreage;
  const totalYieldQuintals = totalYieldKg / 100;

  // Revenue
  const grossRevenue = Math.round(totalYieldQuintals * pricePerQuintal);

  // Default breakdown estimates based on baseline cultivation cost
  const baseCostPerAcre = crop ? crop.cultivationCostPerAcre : 15000;
  
  const seedExpense = seedCost !== null ? Number(seedCost) : Math.round(baseCostPerAcre * 0.15 * acreage);
  const fertilizerExpense = fertilizerCost !== null ? Number(fertilizerCost) : Math.round(baseCostPerAcre * 0.25 * acreage);
  const laborExpense = laborCost !== null ? Number(laborCost) : Math.round(baseCostPerAcre * 0.30 * acreage);
  const irrigationExpense = irrigationCost !== null ? Number(irrigationCost) : Math.round(baseCostPerAcre * 0.12 * acreage);
  const machineryExpense = machineryCost !== null ? Number(machineryCost) : Math.round(baseCostPerAcre * 0.10 * acreage);
  const transportExpense = Math.round(totalYieldQuintals * Number(transportCostPerQuintal));
  const miscExpense = otherCost !== null ? Number(otherCost) : Math.round(baseCostPerAcre * 0.08 * acreage);

  const totalExpenses = Math.round(
    seedExpense +
    fertilizerExpense +
    laborExpense +
    irrigationExpense +
    machineryExpense +
    transportExpense +
    miscExpense
  );

  const netProfit = grossRevenue - totalExpenses;
  const profitPerAcre = acreage > 0 ? Math.round(netProfit / acreage) : netProfit;
  const roiPercentage = totalExpenses > 0 ? parseFloat(((netProfit / totalExpenses) * 100).toFixed(2)) : 0;
  const breakEvenPricePerQuintal = totalYieldQuintals > 0 ? Math.round(totalExpenses / totalYieldQuintals) : 0;

  return {
    cropName: crop ? crop.name : "Custom Crop",
    acreage: Number(acreage),
    productionMetrics: {
      yieldPerAcreKg,
      totalYieldKg,
      totalYieldQuintals
    },
    pricingMetrics: {
      pricePerQuintal,
      breakEvenPricePerQuintal
    },
    financialSummary: {
      grossRevenue,
      totalExpenses,
      netProfit,
      profitPerAcre,
      roiPercentage,
      isProfitable: netProfit > 0
    },
    costBreakdown: {
      seedExpense,
      fertilizerExpense,
      laborExpense,
      irrigationExpense,
      machineryExpense,
      transportExpense,
      miscExpense
    }
  };
};

module.exports = {
  calculateProfit
};
