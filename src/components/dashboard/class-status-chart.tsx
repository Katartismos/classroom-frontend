import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClassDetails } from "@/types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart as PieChartIcon, CheckCircle2, XCircle, Users } from "lucide-react";

interface ClassStatusChartProps {
  classes: ClassDetails[];
  isLoading?: boolean;
}

export const ClassStatusChart: React.FC<ClassStatusChartProps> = ({
  classes,
  isLoading = false,
}) => {
  const { statusData, activeCount, inactiveCount, totalCapacity, avgCapacity } =
    useMemo(() => {
      let active = 0;
      let inactive = 0;
      let capacitySum = 0;

      classes.forEach((cls) => {
        if (cls.status === "active") active += 1;
        else inactive += 1;
        capacitySum += cls.capacity || 0;
      });

      const data = [
        { name: "Active Classes", value: active, color: "var(--primary)" },
        {
          name: "Inactive Classes",
          value: inactive,
          color: "var(--muted-foreground)",
        },
      ].filter((d) => d.value > 0);

      const avg = classes.length > 0 ? Math.round(capacitySum / classes.length) : 0;

      return {
        statusData: data,
        activeCount: active,
        inactiveCount: inactive,
        totalCapacity: capacitySum,
        avgCapacity: avg,
      };
    }, [classes]);

  if (isLoading) {
    return (
      <Card className="border border-border/80 shadow-xs">
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="h-[320px] flex items-center justify-center">
          <Skeleton className="h-44 w-44 rounded-full" />
        </CardContent>
      </Card>
    );
  }

  const hasClasses = classes.length > 0;

  return (
    <Card className="border border-border/80 bg-card/60 backdrop-blur-xs shadow-xs transition-all hover:shadow-md">
      <CardHeader className="space-y-1 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <PieChartIcon className="h-4 w-4" />
          </div>
          <CardTitle className="text-base sm:text-lg font-bold">
            Class Status & Health
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Operational ratio and average seating capacity breakdown
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        {!hasClasses ? (
          <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-center border border-dashed border-border/60 rounded-xl bg-muted/20 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <PieChartIcon className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              No classes created yet
            </p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Status distribution and capacity ratios will show here dynamically.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative h-[180px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0];
                        return (
                          <div className="rounded-lg border border-border bg-popover/95 p-2 text-xs shadow-md backdrop-blur-xs">
                            <span className="font-semibold text-popover-foreground">
                              {item.name}:
                            </span>{" "}
                            <strong className="text-primary">{item.value}</strong>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="var(--card)"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut metric */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-foreground">
                  {classes.length}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Classes
                </span>
              </div>
            </div>

            {/* Quick Status Pill breakdown */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    Active
                  </p>
                  <p className="text-base font-bold text-foreground">
                    {activeCount}{" "}
                    <span className="text-[10px] text-muted-foreground font-normal">
                      ({classes.length ? Math.round((activeCount / classes.length) * 100) : 0}%)
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-muted/60 border border-border p-2.5">
                <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    Inactive
                  </p>
                  <p className="text-base font-bold text-foreground">
                    {inactiveCount}{" "}
                    <span className="text-[10px] text-muted-foreground font-normal">
                      ({classes.length ? Math.round((inactiveCount / classes.length) * 100) : 0}%)
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground rounded-lg bg-muted/30 px-3 py-2 border border-border/30">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>Avg. Class Capacity:</span>
              </div>
              <strong className="text-foreground font-semibold">
                {avgCapacity} seats / class
              </strong>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
