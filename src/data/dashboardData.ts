// Import the dynamically updated JSON data layer emitted by the Jupyter engine
import rawDashboardData from './dashboardData.json';

// Explicit type definition for location arrays to secure downstream shadcn UI elements
export interface RegionalMetric {
  region: string;
  riskScore: number;
  prevalence: number;
  tier: "Critical" | "High" | "Moderate" | "Low";
  lat: number;
  lng: number;
}

// 1. Structural KPIs
export const kpiData = rawDashboardData.kpiData;

// 2. Spatial Mapping & Risk Stratification
export const regionalData = rawDashboardData.regionalData.map((item) => ({
  ...item,
  tier: item.tier as "Critical" | "High" | "Moderate" | "Low",
})) as RegionalMetric[];

// 3. Algorithm Drivers (XGBoost Feature Importance weights)
export const featureImportanceData = rawDashboardData.featureImportanceData;

// 4. Verification Matrices & Validation Curves
export const confusionMatrix = rawDashboardData.confusionMatrix;
export const modelComparison = rawDashboardData.modelComparison;
export const rocCurveData = rawDashboardData.rocCurveData;

// Static 45-degree reference line for the ROC chart layout
export const rocDiagonal = [
  { fpr: 0, tpr: 0 },
  { fpr: 1, tpr: 1 },
];

// Threshold tune arrays for precision/recall optimization sliders
export const precisionRecallData = rawDashboardData.precisionRecallData;

// 5. SEIR Baseline data from notebook computations
export const baselineSEIRData = rawDashboardData.seirData || [];

/**
 * Client-Side SEIR Intervention Simulator
 * Uses baseline data from notebook computations and applies intervention effects
 * to model the impact of LLIN/IRS coverage on malaria transmission.
 */
export function generateSEIRData(interventionEffect: number = 0) {
  // If baseline data exists from notebook, use it as foundation
  if (baselineSEIRData.length > 0) {
    // For 0% intervention, return baseline data directly
    if (interventionEffect === 0) {
      return baselineSEIRData;
    }

    // For interventions > 0, scale the infected curve based on transmission reduction
    // Intervention reduces beta proportionally, which reduces peak infections
    const reductionFactor = interventionEffect; // 0 to 0.8
    const peakBaseline = Math.max(...baselineSEIRData.map((d) => d.Infected));

    return baselineSEIRData.map((datapoint) => {
      // Scale down infections proportionally; recovered increase as intervention prevents new infections
      const infectionReduction = peakBaseline * reductionFactor;
      const scaledInfected = Math.max(0, datapoint.Infected - infectionReduction * (datapoint.Infected / peakBaseline));

      return {
        day: datapoint.day,
        Susceptible: Math.round(datapoint.Susceptible + (datapoint.Infected - scaledInfected) * 0.5),
        Exposed: Math.round(datapoint.Exposed * (1 - reductionFactor * 0.5)),
        Infected: Math.round(scaledInfected),
        Recovered: Math.round(datapoint.Recovered + (datapoint.Infected - scaledInfected) * 0.5),
      };
    });
  }

  // Fallback: Client-side simulation if no baseline data (backward compatibility)
  const days = 200;
  const N = 10000;
  const data = [];

  let S = 9000;
  let E = 500;
  let I = 400;
  let R = 100;

  const beta = 0.3 * (1 - interventionEffect);
  const sigma = 0.1;
  const gamma = 0.05;

  for (let day = 0; day <= days; day++) {
    data.push({
      day,
      Susceptible: Math.round(S),
      Exposed: Math.round(E),
      Infected: Math.round(I),
      Recovered: Math.round(R),
    });

    const dS = (-beta * S * I) / N;
    const dE = (beta * S * I) / N - sigma * E;
    const dI = sigma * E - gamma * I;
    const dR = gamma * I;

    S = Math.max(0, S + dS);
    E = Math.max(0, E + dE);
    I = Math.max(0, I + dI);
    R = Math.max(0, R + dR);
  }

  return data;
}