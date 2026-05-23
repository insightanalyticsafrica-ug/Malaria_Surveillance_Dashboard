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

/**
 * Client-Side Deterministic SEIR Epidemiological Simulation Engine
 * Runs execution calculations inside the browser memory loop so adjustments 
 * using Tailwind components and sliders are smooth and instant.
 */
export function generateSEIRData(interventionEffect: number = 0) {
  const days = 200;
  const N = 10000;
  const data = [];

  let S = 9000;
  let E = 500;
  let I = 400;
  let R = 100;

  // Intervention variations scale transmission rates dynamically
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