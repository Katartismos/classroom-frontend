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
import { Skeleton } from "@/components/ui/skeleton";
import { Subject, ClassDetails } from "@/types";
import { useNavigation } from "@refinedev/core";
import { BookOpen, ArrowRight, PlusCircle, Bookmark } from "lucide-react";

interface SubjectsOverviewProps {
  subjects: Subject[];
  classes: ClassDetails[];
  isLoading?: boolean;
}

export const SubjectsOverview: React.FC<SubjectsOverviewProps> = ({
  subjects,
  classes,
  isLoading = false,
}) => {
  const { create, list } = useNavigation();

  // Compute class count per subject
  const subjectClassCounts = React.useMemo(() => {
    const counts: Record<number | string, number> = {};
    classes.forEach((cls) => {
      const subId = cls.subject?.id || cls.subject?.name;
      if (subId) {
        counts[subId] = (counts[subId] || 0) + 1;
      }
    });
    return counts;
  }, [classes]);

  if (isLoading) {
    return (
      <Card className="border border-border/80 shadow-xs">
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const displaySubjects = subjects.slice(0, 5);

  return (
    <Card className="border border-border/80 bg-card/60 backdrop-blur-xs shadow-xs transition-all hover:shadow-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold">
              Curriculum & Subjects
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Academic departments and registered syllabus modules
          </CardDescription>
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="text-xs font-semibold gap-1 text-primary hover:text-primary/80"
          onClick={() => list("subjects")}
        >
          View All ({subjects.length})
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {displaySubjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-muted/20 py-8 px-4 text-center">
            <Bookmark className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm font-semibold text-foreground">
              No subjects registered yet
            </p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Add subjects to assign them to classes and courses.
            </p>
            <Button
              onClick={() => create("subjects")}
              size="sm"
              variant="outline"
              className="gap-1.5 mt-2 text-xs"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Add Subject
            </Button>
          </div>
        ) : (
          displaySubjects.map((subj) => {
            const classCount =
              subjectClassCounts[subj.id] ||
              subjectClassCounts[subj.name] ||
              0;
            const deptName =
              typeof subj.department === "object" && subj.department !== null
                ? (subj.department as any).name
                : subj.department || "Academic";

            return (
              <div
                key={subj.id}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/80 p-3 transition-all hover:border-primary/40 hover:bg-muted/30"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-bold text-primary border border-primary/20">
                    {subj.code || subj.name.substring(0, 3).toUpperCase()}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {subj.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 h-4 font-normal"
                      >
                        {deptName}
                      </Badge>
                      {subj.description && (
                        <p className="text-[11px] text-muted-foreground truncate hidden sm:inline">
                          {subj.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-xs font-bold text-primary">
                    {classCount}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-1">
                    {classCount === 1 ? "Class" : "Classes"}
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
