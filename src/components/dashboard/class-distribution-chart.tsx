import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClassDetails, Subject } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClassDistributionChartProps {
  classes: ClassDetails[];
  subjects: Subject[];
  isLoading?: boolean;
}

export const ClassDistributionChart: React.FC<ClassDistributionChartProps> = ({
  classes,
  subjects,
  isLoading = false,
}) => {
  const [viewMetric, setViewMetric] = useState<"classes" | "capacity">("classes");

  const chartData = useMemo(() => {
    if (!subjects.length && !classes.length) return [];

    // Map by subject name
    const subjectMap = new Map<
      string,
      {
        name: string;
        code: string;
        classCount: number;
        activeClasses: number;
        totalCapacity: number;
      }
    >();

    // Seed with known subjects
    subjects.forEach((subj) => {
      subjectMap.set(subj.name, {
        name: subj.name,
        code: subj.code || subj.name.substring(0, 4).toUpperCase(),
        classCount: 0,
        activeClasses: 0,
        totalCapacity: 0,
      });
    });

    // Populate with actual classes
    classes.forEach((cls) => {
      const subjectName = cls.subject?.name || "General";
      if (!subjectMap.has(subjectName)) {
        subjectMap.set(subjectName, {
          name: subjectName,
          code: cls.subject?.code || subjectName.substring(0, 4).toUpperCase(),
          classCount: 0,
          activeClasses: 0,
          totalCapacity: 0,
        });
      }

      const entry = subjectMap.get(subjectName)!;
      entry.classCount += 1;
      if (cls.status === "active") {
        entry.activeClasses += 1;
      }
      entry.totalCapacity += cls.capacity || 0;
    });

    return Array.from(subjectMap.values()).slice(0, 8); // top 8 for clean visual
  }, [classes, subjects]);

  if (isLoading) {
    return (
      <Card className="border border-border/80 shadow-xs">
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="h-[320px] flex items-center justify-center">
          <Skeleton className="h-full w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const hasData = chartData.some((d) => d.classCount > 0 || d.totalCapacity > 0);

  return (
    <Card className="border border-border/80 bg-card/60 backdrop-blur-xs shadow-xs transition-all hover:shadow-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-4 w-4" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold">
              Subject & Academic Load
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {viewMetric === "classes"
              ? "Comparison of total vs. active classes across academic subjects"
              : "Aggregate student seating capacity distributed by subject"}
          </CardDescription>
        </div>

        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/50 text-xs">
          <Button
            size="sm"
            variant={viewMetric === "classes" ? "default" : "ghost"}
            className="h-7 text-xs px-2.5 rounded-md font-medium"
            onClick={() => setViewMetric("classes")}
          >
            Classes
          </Button>
          <Button
            size="sm"
            variant={viewMetric === "capacity" ? "default" : "ghost"}
            className="h-7 text-xs px-2.5 rounded-md font-medium"
            onClick={() => setViewMetric("capacity")}
          >
            Capacity
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {!hasData ? (
          <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-center border border-dashed border-border/60 rounded-xl bg-muted/20 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Layers className="h-6 w-6" />
            </div>
            <div className="space-y-1 max-w-sm">
              <p className="text-sm font-semibold text-foreground">
                No class distributions yet
              </p>
              <p className="text-xs text-muted-foreground">
                Once classes and subjects are created, dynamic load analytics and
                capacity distribution will render here.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border/40"
                  vertical={false}
                />
                <XAxis
                  dataKey="code"
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-border bg-popover/95 p-3 text-xs shadow-md backdrop-blur-xs">
                          <p className="font-bold text-popover-foreground mb-1">
                            {data.name} ({data.code})
                          </p>
                          <div className="space-y-1 text-muted-foreground">
                            <p className="flex items-center justify-between gap-4">
                              <span>Total Classes:</span>
                              <strong className="text-foreground">
                                {data.classCount}
                              </strong>
                            </p>
                            <p className="flex items-center justify-between gap-4">
                              <span>Active Classes:</span>
                              <strong className="text-emerald-500">
                                {data.activeClasses}
                              </strong>
                            </p>
                            <p className="flex items-center justify-between gap-4 border-t border-border/40 pt-1">
                              <span>Student Capacity:</span>
                              <strong className="text-primary">
                                {data.totalCapacity}
                              </strong>
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: "12px", fontSize: "11px" }}
                />
                {viewMetric === "classes" ? (
                  <>
                    <Bar
                      dataKey="classCount"
                      name="Total Classes"
                      fill="var(--primary)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={36}
                    />
                    <Bar
                      dataKey="activeClasses"
                      name="Active Classes"
                      fill="var(--chart-3, #10b981)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={36}
                    />
                  </>
                ) : (
                  <Bar
                    dataKey="totalCapacity"
                    name="Student Capacity"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={44}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
