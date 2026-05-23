import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { featureImportanceData, precisionRecallData } from "@/data/dashboardData";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, // 👈 Added "Cell" here
  LineChart, Line, ReferenceLine, Legend,
} from "recharts";

// 💡 You can still keep this for the legend, or update the legend colors to match your Python colors!
const categoryColors: Record<string, string> = {
  Housing: "#FF0000",          // Red
  Socioeconomic: "#FFA500",    // Orange
  Intervention: "#008000",     // Green
  Environment: "#87CEEB",      // Light Blue
  Geographic: "#A020F0",       // Purple
  Demographics: "#A020F0",     // Purple
};

export function RiskDriversSection() {
  const [threshold, setThreshold] = useState(0.5);

  const currentPR = precisionRecallData.reduce((prev, curr) =>
    Math.abs(curr.threshold - threshold) < Math.abs(prev.threshold - threshold) ? curr : prev
  );

  return (
    <section id="drivers" className="scroll-mt-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Risk Drivers</h2>
        <p className="text-muted-foreground mt-1">
          XGBoost feature importance — key predictors of childhood malaria
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Feature Importance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Feature Importance (XGBoost)</CardTitle>
            <CardDescription className="text-xs">Relative contribution to prediction accuracy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={featureImportanceData}
                  layout="vertical"
                  margin={{ left: 110, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  {/* Adjusted domain to auto or matching your maximum importance values */}
                  <XAxis type="number" domain={[0, 'auto']} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="feature" tick={{ fontSize: 11 }} width={105} />
                  <Tooltip
                    formatter={(value: number) => [value.toFixed(4), "Importance"]}
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(214, 20%, 88%)",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                    {/* 🛠️ FIX HERE: Use <Cell /> and bind to entry.color coming from Python */}
                    {featureImportanceData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4">
              {Object.entries(categoryColors).map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-muted-foreground">{cat}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Precision-Recall Tradeoff */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Precision–Recall Tradeoff</CardTitle>
            <CardDescription className="text-xs">
              Adjust the classification threshold to explore the tradeoff
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Threshold: {threshold.toFixed(1)}</span>
                <div className="flex gap-4 text-xs">
                  <span>Precision: <strong>{(currentPR.precision * 100).toFixed(0)}%</strong></span>
                  <span>Recall: <strong>{(currentPR.recall * 100).toFixed(0)}%</strong></span>
                </div>
              </div>
              <Slider
                value={[threshold]}
                onValueChange={([v]) => setThreshold(v)}
                min={0.1}
                max={0.9}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={precisionRecallData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  <XAxis dataKey="threshold" tick={{ fontSize: 11 }} label={{ value: "Threshold", position: "bottom", fontSize: 11 }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12, border: "1px solid hsl(214, 20%, 88%)" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <ReferenceLine x={threshold} stroke="hsl(215, 14%, 46%)" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="precision" stroke="hsl(200, 70%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="recall" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insight */}
      <Card className="mt-6 border-[hsl(var(--chart-1))]/30 bg-[hsl(var(--chart-1))]/5">
        <CardContent className="py-4">
          <p className="text-sm">
            <strong>Key Insight:</strong> Housing quality (thatch roof vs. iron sheet) is the strongest predictor of childhood malaria, contributing 45% of the model's predictive power. This aligns with the hypothesis that housing improvements could be an effective intervention strategy alongside ITN distribution.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}