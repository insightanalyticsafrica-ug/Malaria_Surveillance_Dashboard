import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, LayoutDashboard, Map, BarChart3, Activity, FlaskConical } from "lucide-react";

const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "regional", label: "Regional Risk", icon: Map },
  { id: "drivers", label: "Risk Drivers", icon: BarChart3 },
  { id: "simulation", label: "SEIR Model", icon: Activity },
  { id: "performance", label: "Model Perf.", icon: FlaskConical },
];

export function DashboardNav() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActive(topmost.target.id);
        }
      },
      { threshold: 0.3 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1.5 bg-card/80 backdrop-blur-lg border border-border rounded-2xl p-2 shadow-lg">
      <button
        onClick={() => scrollTo("top")}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
        title="Back to top"
      >
        <ChevronUp className="w-4 h-4" />
        <span className="hidden lg:inline">Top</span>
      </button>
      {sections.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all",
            active === id
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          title={label}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden lg:inline">{label}</span>
        </button>
      ))}
    </nav>
  );
}
