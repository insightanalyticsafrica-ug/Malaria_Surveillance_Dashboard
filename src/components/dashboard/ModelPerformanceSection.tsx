import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { confusionMatrix, modelComparison, rocCurveData, rocDiagonal } from "@/data/dashboardData";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const cmTotal = confusionMatrix.truePositive + confusionMatrix.falsePositive + confusionMatrix.falseNegative + confusionMatrix.trueNegative;

function CellBox({ value, label, color, intensity }: { value: number; label: string; color: string; intensity: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center p-4 rounded-lg"
      style={{ backgroundColor: `${color}${Math.round(intensity * 255).toString(16).padStart(2, "0")}` }}
    >
      <span className="text-xl font-bold">{value.toLocaleString()}</span>
      <span className="text-xs mt-1 text-muted-foreground">{label}</span>
    </div>
  );
}

export function ModelPerformanceSection() {
  return (
    <section id="performance" className="scroll-mt-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Model Performance</h2>
        <p className="text-muted-foreground mt-1">
          Comparative evaluation of classification models on the Uganda MIS dataset
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Confusion Matrix (XGBoost)</CardTitle>
            <CardDescription className="text-xs">n = {cmTotal.toLocaleString()} samples</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div />
                <div className="text-center text-xs font-medium text-muted-foreground">Predicted +</div>
                <div className="text-center text-xs font-medium text-muted-foreground">Predicted −</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center text-xs font-medium text-muted-foreground">Actual +</div>
                <CellBox value={confusionMatrix.truePositive} label="TP" color="hsl(152, 60%, 36%)" intensity={0.2} />
                <CellBox value={confusionMatrix.falseNegative} label="FN" color="hsl(0, 72%, 51%)" intensity={0.15} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center text-xs font-medium text-muted-foreground">Actual −</div>
                <CellBox value={confusionMatrix.falsePositive} label="FP" color="hsl(38, 92%, 50%)" intensity={0.15} />
                <CellBox value={confusionMatrix.trueNegative} label="TN" color="hsl(152, 60%, 36%)" intensity={0.25} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-lg font-bold">76%</p>
                <p className="text-xs text-muted-foreground">Precision</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">75%</p>
                <p className="text-xs text-muted-foreground">Recall</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">75%</p>
                <p className="text-xs text-muted-foreground">F1 Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROC Curve */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">ROC Curve</CardTitle>
            <CardDescription className="text-xs">AUC = 0.82 — XGBoost classifier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart margin={{ left: 5, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  <XAxis
                    dataKey="fpr"
                    type="number"
                    domain={[0, 1]}
                    tick={{ fontSize: 11 }}
                    label={{ value: "False Positive Rate", position: "bottom", fontSize: 11, offset: 11 }}
                  />
                  <YAxis
                    dataKey="tpr"
                    type="number"
                    domain={[0, 1]}
                    tick={{ fontSize: 11 }}
                    label={{ value: "True Positive Rate", angle: -90, position: "insideLeft", fontSize: 11, offset: 15 }}
                  />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12, border: "1px solid hsl(214, 20%, 88%)" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line data={rocDiagonal} dataKey="tpr" name="Random" stroke="hsl(215, 14%, 46%)" strokeDasharray="5 5" dot={false} />
                  <Line data={rocCurveData} dataKey="tpr" name="XGBoost (AUC=0.82)" stroke="hsl(200, 70%, 50%)" strokeWidth={2.5} dot={{ r: 2.5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Comparison Table */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Model Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Model</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Accuracy</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">AUC-ROC</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Precision</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Recall</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">F1</th>
                </tr>
              </thead>
              <tbody>
                {modelComparison.map((m, i) => (
                  <tr
                    key={m.model}
                    className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${i === 0 ? "bg-[hsl(var(--chart-1))]/5" : ""}`}
                  >
                    <td className="p-3 font-medium">
                      {m.model}
                      {i === 0 && (
                        <span className="ml-2 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                          BEST
                        </span>
                      )}
                    </td>
                    <td className="p-3">{(m.accuracy).toFixed(0)}%</td>
                    <td className="p-3">{m.auc.toFixed(2)}</td>
                    <td className="p-3">{(m.precision).toFixed(0)}%</td>
                    <td className="p-3">{(m.recall).toFixed(0)}%</td>
                    <td className="p-3">{(m.f1).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
