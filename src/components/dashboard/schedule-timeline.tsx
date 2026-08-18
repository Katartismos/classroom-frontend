import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassDetails } from "@/types";
import { useNavigation } from "@refinedev/core";
import {
  CalendarDays,
  Clock,
  User,
  BookOpen,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleTimelineProps {
  classes: ClassDetails[];
  isLoading?: boolean;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAY_NUMBER_MAP: Record<number, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
  0: "Sunday",
};

interface ScheduledSlot {
  classId: number;
  className: string;
  subjectName: string;
  teacherName?: string;
  startTime: string;
  endTime: string;
  day: string;
  status: "active" | "inactive";
  bannerUrl?: string;
}

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  classes,
  isLoading = false,
}) => {
  const { show } = useNavigation();
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const [selectedDay, setSelectedDay] = useState<string>(
    DAYS_OF_WEEK.includes(todayName) ? todayName : "Monday"
  );

  // Group schedules
  const scheduleByDay = useMemo(() => {
    const map: Record<string, ScheduledSlot[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    classes.forEach((cls) => {
      if (!cls.schedules || !Array.isArray(cls.schedules)) return;

      cls.schedules.forEach((sch: any) => {
        let dayName = "";
        if (typeof sch.day === "string" && sch.day) {
          // Normalize day string
          const formatted =
            sch.day.charAt(0).toUpperCase() + sch.day.slice(1).toLowerCase();
          if (map[formatted]) dayName = formatted;
        } else if (typeof sch.dayOfWeek === "number") {
          dayName = DAY_NUMBER_MAP[sch.dayOfWeek] || "Monday";
        }

        if (!dayName) dayName = "Monday";

        map[dayName].push({
          classId: cls.id,
          className: cls.name,
          subjectName: cls.subject?.name || "General",
          teacherName: cls.teacher?.name,
          startTime: sch.startTime || "09:00",
          endTime: sch.endTime || "10:30",
          day: dayName,
          status: cls.status,
          bannerUrl: cls.bannerUrl,
        });
      });
    });

    // Sort slots by startTime
    Object.keys(map).forEach((day) => {
      map[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return map;
  }, [classes]);

  const currentSlots = scheduleByDay[selectedDay] || [];
  const totalWeeklySessions = useMemo(() => {
    return Object.values(scheduleByDay).reduce(
      (sum, list) => sum + list.length,
      0
    );
  }, [scheduleByDay]);

  if (isLoading) {
    return (
      <Card className="border border-border/80 shadow-xs">
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-md shrink-0" />
            ))}
          </div>
          <div className="space-y-2 pt-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/80 bg-card/60 backdrop-blur-xs shadow-xs transition-all hover:shadow-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarDays className="h-4 w-4" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold">
              Weekly Timetable & Schedule
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Filter scheduled lectures, timetable sessions, and course timings by day
          </CardDescription>
        </div>

        <Badge variant="outline" className="w-fit text-xs font-semibold px-2.5 py-1 gap-1.5">
          <Sparkles className="h-3 w-3 text-primary" />
          {totalWeeklySessions} Scheduled Sessions
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {/* Day selection tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {DAYS_OF_WEEK.map((day) => {
            const count = scheduleByDay[day]?.length || 0;
            const isSelected = selectedDay === day;
            const isToday = todayName === day;

            return (
              <Button
                key={day}
                size="sm"
                variant={isSelected ? "default" : "outline"}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "relative shrink-0 gap-1.5 text-xs h-8 px-3 rounded-lg font-medium transition-all",
                  !isSelected && "bg-muted/40 hover:bg-muted border-border/60"
                )}
              >
                <span>{day.substring(0, 3)}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                      isSelected
                        ? "bg-primary-foreground text-primary"
                        : "bg-primary/20 text-primary"
                    )}
                  >
                    {count}
                  </span>
                )}
                {isToday && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Timetable Session list */}
        {currentSlots.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-muted/20 py-10 px-4 text-center">
            <Clock className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm font-semibold text-foreground">
              No sessions scheduled for {selectedDay}
            </p>
            <p className="text-xs text-muted-foreground max-w-xs">
              When class schedules include {selectedDay}, timetable sessions will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {currentSlots.map((slot, idx) => (
              <div
                key={`${slot.classId}-${idx}`}
                onClick={() => show("classes", slot.classId)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/80 p-3.5 transition-all duration-200 hover:border-primary/40 hover:bg-muted/40 cursor-pointer hover:shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center justify-center rounded-lg bg-primary/10 px-2.5 py-1.5 text-primary border border-primary/20 shrink-0 min-w-20 text-center">
                    <div className="flex items-center gap-1 text-[11px] font-bold">
                      <Clock className="h-3 w-3" />
                      <span>{slot.startTime}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      to {slot.endTime}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {slot.className}
                      </h4>
                      <Badge
                        variant={slot.status === "active" ? "default" : "secondary"}
                        className="text-[10px] px-1.5 py-0 h-4 font-medium"
                      >
                        {slot.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-primary" />
                        {slot.subjectName}
                      </span>
                      {slot.teacherName && (
                        <span className="inline-flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {slot.teacherName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end sm:justify-start">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
