import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User, ClassDetails } from "@/types";
import { School, Mail, GraduationCap } from "lucide-react";

interface TeachersSpotlightProps {
  teachers: User[];
  classes: ClassDetails[];
  isLoading?: boolean;
}

export const TeachersSpotlight: React.FC<TeachersSpotlightProps> = ({
  teachers,
  classes,
  isLoading = false,
}) => {
  // Count classes per teacher
  const teacherClassCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    classes.forEach((cls) => {
      const tId = cls.teacher?.id || cls.teacher?.name;
      if (tId) {
        counts[tId] = (counts[tId] || 0) + 1;
      }
    });
    return counts;
  }, [classes]);

  if (isLoading) {
    return (
      <Card className="border border-border/80 shadow-xs">
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const displayTeachers = teachers.slice(0, 5);

  return (
    <Card className="border border-border/80 bg-card/60 backdrop-blur-xs shadow-xs transition-all hover:shadow-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <School className="h-4 w-4" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold">
              Faculty & Instructors
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Assigned educators and active teaching staff
          </CardDescription>
        </div>

        <Badge variant="outline" className="w-fit text-xs font-semibold px-2.5 py-1">
          {teachers.length} Instructors
        </Badge>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {displayTeachers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-muted/20 py-8 px-4 text-center">
            <School className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm font-semibold text-foreground">
              No teachers found
            </p>
            <p className="text-xs text-muted-foreground max-w-xs">
              When instructors are onboarded, their assignments will show here.
            </p>
          </div>
        ) : (
          displayTeachers.map((teacher) => {
            const initials =
              teacher.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "T";

            const assignedCount =
              teacherClassCounts[teacher.id] ||
              teacherClassCounts[teacher.name] ||
              0;

            return (
              <div
                key={teacher.id}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/80 p-3 transition-all hover:border-primary/40 hover:bg-muted/30"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-10 w-10 border border-border shrink-0">
                    <AvatarImage src={teacher.image} alt={teacher.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-0.5 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {teacher.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground/70" />
                        {teacher.email}
                      </span>
                      {teacher.department && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1 py-0 h-4 hidden sm:inline"
                        >
                          {teacher.department}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="flex items-center justify-end gap-1 text-xs font-bold text-primary">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>{assignedCount}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {assignedCount === 1 ? "Class" : "Classes"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
