import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  badge?: {
    text: string;
    variant?: "default" | "success" | "warning" | "info" | "secondary";
  };
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const badgeVariants = {
  default: "bg-primary/10 text-primary border-primary/20",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  info: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  secondary: "bg-secondary text-secondary-foreground border-border",
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  badge,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
  className,
  isLoading = false,
  onClick,
}) => {
  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden border border-border/80 shadow-xs", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden border border-border/80 bg-card/70 backdrop-blur-xs transition-all duration-300 hover:shadow-md hover:border-primary/40",
        onClick && "cursor-pointer hover:-translate-y-0.5",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {value}
              </h3>
            </div>
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 shadow-xs",
              iconBgColor
            )}
          >
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/40 pt-3">
          {description && (
            <p className="text-xs text-muted-foreground font-medium truncate">
              {description}
            </p>
          )}
          {badge && (
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
                badgeVariants[badge.variant || "default"]
              )}
            >
              {badge.text}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
