import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassDetails } from "@/types";
import { useNavigation } from "@refinedev/core";
import {
  GraduationCap,
  Users,
  Calendar,
  ArrowRight,
  PlusCircle,
  Key,
  BookOpen,
} from "lucide-react";

interface RecentClassesProps {
  classes: ClassDetails[];
  isLoading?: boolean;
}

export const RecentClasses: React.FC<RecentClassesProps> = ({
  classes,
  isLoading = false,
}) => {
  const { show, create, list } = useNavigation();

  if (isLoading) {
    return (
      <Card className="border border-border/80 shadow-xs">
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentList = classes.slice(0, 6);

  return (
    <Card className="border border-border/80 bg-card/60 backdrop-blur-xs shadow-xs transition-all hover:shadow-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="h-4 w-4" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold">
              Active Class Roster
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Recently registered classes, capacity limits, and instructor assignments
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs font-semibold gap-1 text-primary hover:text-primary/80"
            onClick={() => list("classes")}
          >
            View All ({classes.length})
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {recentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-muted/20 py-12 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-base font-bold text-foreground">
                No classes registered yet
              </h4>
              <p className="text-xs text-muted-foreground">
                Create your first classroom to schedule sessions, assign teachers,
                and enroll students.
              </p>
            </div>
            <Button
              onClick={() => create("classes")}
              size="sm"
              className="gap-2 mt-2 font-medium"
            >
              <PlusCircle className="h-4 w-4" />
              Create Class
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentList.map((cls) => {
              const teacherInitials =
                cls.teacher?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "T";

              const scheduleCount = cls.schedules?.length || 0;

              return (
                <div
                  key={cls.id}
                  onClick={() => show("classes", cls.id)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-card/90 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/40 cursor-pointer"
                >
                  {/* Banner Header */}
                  <div className="relative h-32 w-full overflow-hidden bg-linear-to-tr from-primary/30 via-accent/20 to-primary/10">
                    {cls.bannerUrl ? (
                      <img
                        src={cls.bannerUrl}
                        alt={cls.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/20 via-primary/5 to-muted">
                        <GraduationCap className="h-10 w-10 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />

                    {/* Status badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <Badge
                        variant={cls.status === "active" ? "default" : "secondary"}
                        className="text-[10px] font-semibold backdrop-blur-xs shadow-xs"
                      >
                        {cls.status}
                      </Badge>
                    </div>

                    {/* Subject badge */}
                    {cls.subject?.name && (
                      <div className="absolute top-2.5 left-2.5">
                        <Badge
                          variant="outline"
                          className="bg-background/80 text-[10px] font-medium backdrop-blur-xs border-border/80"
                        >
                          <BookOpen className="h-2.5 w-2.5 mr-1 text-primary" />
                          {cls.subject.name}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {cls.name}
                      </h4>
                      {cls.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {cls.description}
                        </p>
                      )}
                    </div>

                    {/* Teacher & Capacity row */}
                    <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="h-7 w-7 border border-border">
                          <AvatarImage
                            src={cls.teacher?.image}
                            alt={cls.teacher?.name || "Teacher"}
                          />
                          <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                            {teacherInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="truncate text-xs">
                          <p className="font-semibold text-foreground truncate">
                            {cls.teacher?.name || "Unassigned"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Instructor
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                          <Users className="h-3 w-3 text-primary" />
                          <span>{cls.capacity || 0}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          Capacity
                        </span>
                      </div>
                    </div>

                    {/* Footer with schedules / invite code */}
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-orange-500" />
                        {scheduleCount} {scheduleCount === 1 ? "Session" : "Sessions"}
                      </span>

                      {cls.inviteCode && (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-muted/60 px-1.5 py-0.5 rounded border border-border/40">
                          <Key className="h-2.5 w-2.5" />
                          {cls.inviteCode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
