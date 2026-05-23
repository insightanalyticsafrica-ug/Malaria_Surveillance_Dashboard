import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { regionalData } from "@/data/dashboardData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

function getTierFill(tier: string) {
  switch (tier) {
    case "Critical": return "hsl(0, 72%, 51%)";
    case "High": return "hsl(15, 80%, 50%)";
    case "Moderate": return "hsl(38, 92%, 50%)";
    case "Low": return "hsl(152, 60%, 36%)";
    default: return "hsl(215, 14%, 46%)";
  }
}

const sortedRegions = [...regionalData].sort((a, b) => b.riskScore - a.riskScore);

const tierCounts = {
  Critical: regionalData.filter((r) => r.tier === "Critical").length,
  High: regionalData.filter((r) => r.tier === "High").length,
  Moderate: regionalData.filter((r) => r.tier === "Moderate").length,
  Low: regionalData.filter((r) => r.tier === "Low").length,
};

const tierColors = [
  { tier: "Critical", color: "hsl(0, 72%, 51%)", count: tierCounts.Critical },
  { tier: "High", color: "hsl(15, 80%, 50%)", count: tierCounts.High },
  { tier: "Moderate", color: "hsl(38, 92%, 50%)", count: tierCounts.Moderate },
  { tier: "Low", color: "hsl(152, 60%, 36%)", count: tierCounts.Low },
];

export function RegionalRiskSection() {
  return (
    <section id="regional" className="scroll-mt-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Regional Risk Analysis</h2>
        <p className="text-muted-foreground mt-1">
          Malaria risk scores and prevalence rates across 15 Ugandan regions
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk Tier Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Risk Tier Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tierColors.map(({ tier, color, count }) => (
              <div key={tier} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-sm font-medium flex-1">{tier}</span>
                <span className="text-sm text-muted-foreground">{count} regions</span>
                <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(count / 15) * 100}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Regional Risk Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedRegions} layout="vertical" margin={{ left: 70, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="region" tick={{ fontSize: 11 }} width={65} />
                  <Tooltip
                    formatter={(value: number) => [`${(value * 100).toFixed(0)}%`, "Risk Score"]}
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(214, 20%, 88%)",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="riskScore" radius={[0, 4, 4, 0]}>
                    {sortedRegions.map((entry, i) => (
                      <Cell key={i} fill={getTierFill(entry.tier)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Region Table */}
      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Region</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Risk Score</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Prevalence</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Tier</th>
                </tr>
              </thead>
              <tbody>
                {sortedRegions.map((r) => (
                  <tr key={r.region} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{r.region}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${r.riskScore * 100}%`, backgroundColor: getTierFill(r.tier) }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{(r.riskScore * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="p-3">{r.prevalence}%</td>
                    <td className="p-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: getTierFill(r.tier) }}
                      >
                        {r.tier}
                      </span>
                    </td>
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
