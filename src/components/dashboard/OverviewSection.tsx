import { Card, CardContent } from "@/components/ui/card";
import { kpiData, regionalData } from "@/data/dashboardData";
import { Users, Target, TrendingUp, Activity, AlertTriangle, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const kpis = [
  { label: "Children Tested", value: kpiData.childrenTested.toLocaleString(), icon: Users, color: "hsl(var(--chart-2))" },
  { label: "Malaria Prevalence", value: `${kpiData.malariaPrevalence}%`, icon: Activity, color: "hsl(var(--risk-high))" },
  { label: "XGBoost Accuracy", value: `${kpiData.modelAccuracy}%`, icon: Target, color: "hsl(var(--chart-1))" },
  { label: "AUC-ROC Score", value: kpiData.aucRoc.toString(), icon: TrendingUp, color: "hsl(var(--chart-4))" },
  { label: "R₀ (Basic Reproduction)", value: kpiData.r0.toString(), icon: AlertTriangle, color: "hsl(var(--risk-critical))" },
  { label: "Regions Analyzed", value: kpiData.regionsAnalyzed.toString(), icon: MapPin, color: "hsl(var(--chart-3))" },
];

function getTierColor(tier: string) {
  switch (tier) {
    case "Critical": return "bg-[hsl(var(--risk-critical))] text-white";
    case "High": return "bg-[hsl(var(--risk-high))] text-white";
    case "Moderate": return "bg-[hsl(var(--risk-moderate))] text-white";
    case "Low": return "bg-[hsl(var(--risk-low))] text-white";
    default: return "bg-muted text-muted-foreground";
  }
}

export function OverviewSection() {
  const criticalRegions = regionalData.filter((r) => r.tier === "Critical" || r.tier === "High");

  return (
    <section id="overview" className="scroll-mt-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-1">
          Uganda Malaria Indicator Survey — Spatio-temporal ML Analysis
        </p>
      </div>

      {/* Alert Banner */}
      <Card className="mb-6 border-[hsl(var(--risk-critical))]/30 bg-[hsl(var(--risk-critical))]/5">
        <CardContent className="flex items-center gap-3 py-4">
          <AlertTriangle className="w-5 h-5 text-[hsl(var(--risk-critical))] shrink-0" />
          <div>
            <p className="font-semibold text-sm">Outbreak Alert</p>
            <p className="text-xs text-muted-foreground">
              {criticalRegions.length} regions flagged as High/Critical risk — {criticalRegions.map((r) => r.region).join(", ")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}15` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Region Summary */}
      <Card className="mt-6">
        <CardContent className="p-5">
          <h3 className="font-semibold mb-3 text-sm">Regional Risk Summary</h3>
          <div className="flex flex-wrap gap-2">
            {regionalData
              .sort((a, b) => b.riskScore - a.riskScore)
              .map((r) => (
                <Badge key={r.region} className={`${getTierColor(r.tier)} text-xs`}>
                  {r.region}: {(r.riskScore * 100).toFixed(0)}%
                </Badge>
              ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
