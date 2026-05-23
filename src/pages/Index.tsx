import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { RegionalRiskSection } from "@/components/dashboard/RegionalRiskSection";
import { RiskDriversSection } from "@/components/dashboard/RiskDriversSection";
import { SEIRSection } from "@/components/dashboard/SEIRSection";
import { ModelPerformanceSection } from "@/components/dashboard/ModelPerformanceSection";
import { Activity } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">Malaria Surveillance Dashboard</h1>
          </div>
          <span className="text-xs text-muted-foreground ml-auto hidden sm:block">
            Uganda MIS · Spatio-temporal ML Analysis
          </span>
        </div>
      </header>

      {/* Navigation */}
      <DashboardNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pr-20 space-y-16">
        <OverviewSection />
        <RegionalRiskSection />
        <RiskDriversSection />
        <SEIRSection />
        <ModelPerformanceSection />

        {/* Footer */}
        <footer className="border-t pt-6 pb-8 text-center">
          <p className="text-xs text-muted-foreground">
            Data Source: Uganda Malaria Indicator Survey (MIS) · XGBoost & SEIR Model Results
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Built for research visualization — not for clinical decision-making
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
