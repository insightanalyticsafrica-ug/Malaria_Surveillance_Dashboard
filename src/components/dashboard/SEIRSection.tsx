import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateSEIRData } from "@/data/dashboardData";
import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const compartmentColors = {
  Susceptible: "hsl(200, 70%, 50%)",
  Exposed: "hsl(38, 92%, 50%)",
  Infected: "hsl(0, 72%, 51%)",
  Recovered: "hsl(152, 60%, 36%)",
};

export function SEIRSection() {
  const [intervention, setIntervention] = useState(0);

  const data = useMemo(() => generateSEIRData(intervention), [intervention]);
  const baseline = useMemo(() => generateSEIRData(0), []);

  const peakInfected = Math.max(...data.map((d) => d.Infected));
  const peakDay = data.find((d) => d.Infected === peakInfected)?.day ?? 0;
  const baselinePeak = Math.max(...baseline.map((d) => d.Infected));
  const reduction = baselinePeak > 0 ? ((baselinePeak - peakInfected) / baselinePeak * 100).toFixed(0) : "0";

  return (
    <section id="simulation" className="scroll-mt-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Outbreak Simulation (SEIR)</h2>
        <p className="text-muted-foreground mt-1">
          Susceptible → Exposed → Infected → Recovered dynamics with intervention modeling
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Controls */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Intervention Controls</CardTitle>
            <CardDescription className="text-xs">
              Simulate LLIN/IRS intervention coverage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-muted-foreground">Coverage</span>
                <span className="text-xs font-semibold">{(intervention * 100).toFixed(0)}%</span>
              </div>
              <Slider
                value={[intervention]}
                onValueChange={([v]) => setIntervention(v)}
                min={0}
                max={0.8}
                step={0.05}
              />
            </div>

            <div className="space-y-3 pt-2 border-t">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Metrics</h4>
              <div>
                <p className="text-xs text-muted-foreground">Peak Infected</p>
                <p className="text-lg font-bold">{peakInfected.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Peak Day</p>
                <p className="text-lg font-bold">Day {peakDay}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Peak Reduction</p>
                <p className="text-lg font-bold text-[hsl(var(--chart-1))]">↓ {reduction}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">R₀ (effective)</p>
                <p className="text-lg font-bold">{(10.09 * (1 - intervention)).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEIR Chart */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              SEIR Compartment Dynamics
              {intervention > 0 && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  ({(intervention * 100).toFixed(0)}% intervention)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    {Object.entries(compartmentColors).map(([key, color]) => (
                      <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 11 }} 
                    label={{ value: "Days", position: "bottom", fontSize: 11, offset: 13 }} 
                    tickFormatter={(tick: number) => tick.toFixed(2)}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12, border: "1px solid hsl(214, 20%, 88%)" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {Object.entries(compartmentColors).map(([key, color]) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={color}
                      strokeWidth={2}
                      fill={`url(#gradient-${key})`}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
