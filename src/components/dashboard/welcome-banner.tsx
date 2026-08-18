import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@refinedev/core";
import {
  GraduationCap,
  BookOpen,
  PlusCircle,
  Sparkles,
  Calendar,
  Layers,
} from "lucide-react";

interface WelcomeBannerProps {
  totalClasses?: number;
  activeClasses?: number;
  totalSubjects?: number;
  totalCapacity?: number;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  totalClasses = 0,
  activeClasses = 0,
  totalSubjects = 0,
  totalCapacity = 0,
}) => {
  const { create, list } = useNavigation();

  // Determine time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 via-card to-card p-6 md:p-8 shadow-sm">
      {/* Ambient background decoration */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 -bottom-12 h-48 w-48 rounded-full bg-accent/15 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Academic Hub
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-xs">
              <Calendar className="h-3.5 w-3.5" />
              {currentDate}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            {getGreeting()}! Welcome to your{" "}
            <span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Classroom Hub
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Monitor academic schedules, manage faculty rosters, and track class
            capacities in real time with dynamic analytics.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <strong className="text-foreground">{activeClasses}</strong> Active
              Classes
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <strong className="text-foreground">{totalSubjects}</strong>{" "}
              Subjects Offered
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-orange-500" />
              <strong className="text-foreground">{totalCapacity}</strong> Total
              Student Seats
            </div>
          </div>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex flex-wrap sm:flex-nowrap md:flex-col lg:flex-row items-stretch sm:items-center gap-3">
          <Button
            onClick={() => create("classes")}
            className="flex-1 sm:flex-initial gap-2 shadow-sm font-medium transition-all hover:scale-[1.02]"
            size="default"
          >
            <PlusCircle className="h-4 w-4" />
            Create Class
          </Button>

          <Button
            onClick={() => create("subjects")}
            variant="outline"
            className="flex-1 sm:flex-initial gap-2 bg-background/80 hover:bg-background backdrop-blur-xs font-medium border-border hover:border-primary/40 transition-all hover:scale-[1.02]"
            size="default"
          >
            <BookOpen className="h-4 w-4" />
            Add Subject
          </Button>

          <Button
            onClick={() => list("classes")}
            variant="ghost"
            className="flex-1 sm:flex-initial gap-2 text-muted-foreground hover:text-foreground transition-all"
            size="default"
          >
            <GraduationCap className="h-4 w-4" />
            Browse All
          </Button>
        </div>
      </div>
    </div>
  );
};
