import React, { useMemo } from "react";
import { useList, useNavigation } from "@refinedev/core";
import { ClassDetails, Subject, User } from "@/types";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/stats-card";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { ClassDistributionChart } from "@/components/dashboard/class-distribution-chart";
import { ClassStatusChart } from "@/components/dashboard/class-status-chart";
import { ScheduleTimeline } from "@/components/dashboard/schedule-timeline";
import { RecentClasses } from "@/components/dashboard/recent-classes";
import { SubjectsOverview } from "@/components/dashboard/subjects-overview";
import { TeachersSpotlight } from "@/components/dashboard/teachers-spotlight";
import {
  GraduationCap,
  BookOpen,
  School,
  Users,
  RotateCw,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const { list } = useNavigation();

  // Fetch Classes
  const {
    query: classesQuery,
  } = useList<ClassDetails>({
    resource: "classes",
    pagination: { mode: "off" },
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  // Fetch Subjects
  const {
    query: subjectsQuery,
  } = useList<Subject>({
    resource: "subjects",
    pagination: { mode: "off" },
    sorters: [{ field: "createdAt", order: "desc" }],
  });

  // Fetch Teachers
  const {
    query: teachersQuery,
  } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "teacher" }],
    pagination: { mode: "off" },
  });

  // Fetch All Users (for student metrics & comprehensive staff view)
  const {
    query: usersQuery,
  } = useList<User>({
    resource: "users",
    pagination: { mode: "off" },
  });

  const classes = useMemo(() => classesQuery.data?.data || [], [classesQuery.data]);
  const subjects = useMemo(() => subjectsQuery.data?.data || [], [subjectsQuery.data]);
  const teachers = useMemo(() => teachersQuery.data?.data || [], [teachersQuery.data]);
  const allUsers = useMemo(() => usersQuery.data?.data || [], [usersQuery.data]);

  const isClassesLoading = classesQuery.isLoading;
  const isSubjectsLoading = subjectsQuery.isLoading;
  const isTeachersLoading = teachersQuery.isLoading;
  const isUsersLoading = usersQuery.isLoading;

  const isAnyLoading =
    isClassesLoading || isSubjectsLoading || isTeachersLoading || isUsersLoading;

  const isFetching =
    classesQuery.isFetching ||
    subjectsQuery.isFetching ||
    teachersQuery.isFetching ||
    usersQuery.isFetching;

  // Refresh handler for Refine queries
  const handleRefresh = () => {
    classesQuery.refetch();
    subjectsQuery.refetch();
    teachersQuery.refetch();
    usersQuery.refetch();
  };

  // Compute calculated metrics
  const stats = useMemo(() => {
    const totalClasses = classes.length;
    const activeClasses = classes.filter((c) => c.status === "active").length;
    const totalCapacity = classes.reduce((sum, c) => sum + (c.capacity || 0), 0);

    const totalSubjects = subjects.length;
    const uniqueDepartments = new Set(
      subjects
        .map((s) =>
          typeof s.department === "object" && s.department !== null
            ? (s.department as any).name
            : s.department
        )
        .filter(Boolean)
    ).size;

    const totalTeachers = teachers.length > 0
      ? teachers.length
      : allUsers.filter((u) => u.role === "teacher").length;

    const totalStudents = allUsers.filter((u) => u.role === "student").length;

    const assignedClasses = classes.filter((c) => !!c.teacher).length;
    const teacherAssignmentRate =
      totalClasses > 0 ? Math.round((assignedClasses / totalClasses) * 100) : 100;

    return {
      totalClasses,
      activeClasses,
      totalCapacity,
      totalSubjects,
      uniqueDepartments,
      totalTeachers,
      totalStudents,
      teacherAssignmentRate,
    };
  }, [classes, subjects, teachers, allUsers]);

  return (
    <ListView className="space-y-6 pb-12">
      {/* Header Row */}
      <div className="space-y-1">
        <Breadcrumb />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Live overview of classroom operations, curriculum, faculty, and student capacity
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isFetching}
              className="gap-2 bg-background/60 hover:bg-background border-border/80 text-xs font-medium"
            >
              <RotateCw
                className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-primary" : ""}`}
              />
              {isFetching ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <WelcomeBanner
        totalClasses={stats.totalClasses}
        activeClasses={stats.activeClasses}
        totalSubjects={stats.totalSubjects}
        totalCapacity={stats.totalCapacity}
      />

      {/* Key Metric KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Classes"
          value={stats.totalClasses}
          icon={GraduationCap}
          description={`${stats.activeClasses} active right now`}
          badge={{
            text: stats.totalClasses > 0 ? `${stats.activeClasses}/${stats.totalClasses} Active` : "Empty",
            variant: stats.activeClasses > 0 ? "success" : "secondary",
          }}
          iconBgColor="bg-blue-500/10"
          iconColor="text-blue-600 dark:text-blue-400"
          isLoading={isClassesLoading}
          onClick={() => list("classes")}
        />

        <StatsCard
          title="Academic Subjects"
          value={stats.totalSubjects}
          icon={BookOpen}
          description={`${stats.uniqueDepartments} department areas`}
          badge={{
            text: `${stats.uniqueDepartments} Depts`,
            variant: "info",
          }}
          iconBgColor="bg-amber-500/10"
          iconColor="text-amber-600 dark:text-amber-400"
          isLoading={isSubjectsLoading}
          onClick={() => list("subjects")}
        />

        <StatsCard
          title="Faculty Members"
          value={stats.totalTeachers}
          icon={School}
          description={`${stats.teacherAssignmentRate}% class assignment rate`}
          badge={{
            text: `${stats.teacherAssignmentRate}% Assigned`,
            variant: stats.teacherAssignmentRate >= 80 ? "success" : "warning",
          }}
          iconBgColor="bg-purple-500/10"
          iconColor="text-purple-600 dark:text-purple-400"
          isLoading={isTeachersLoading || isUsersLoading}
        />

        <StatsCard
          title="Total Seating Capacity"
          value={stats.totalCapacity}
          icon={Users}
          description={`${stats.totalStudents} registered students`}
          badge={{
            text: `${stats.totalCapacity} Seats`,
            variant: "default",
          }}
          iconBgColor="bg-emerald-500/10"
          iconColor="text-emerald-600 dark:text-emerald-400"
          isLoading={isClassesLoading}
        />
      </div>

      {/* Analytics & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClassDistributionChart
            classes={classes}
            subjects={subjects}
            isLoading={isClassesLoading || isSubjectsLoading}
          />
        </div>
        <div className="lg:col-span-1">
          <ClassStatusChart
            classes={classes}
            isLoading={isClassesLoading}
          />
        </div>
      </div>

      {/* Weekly Schedule & Timetable */}
      <ScheduleTimeline
        classes={classes}
        isLoading={isClassesLoading}
      />

      {/* Recent Class Roster */}
      <RecentClasses
        classes={classes}
        isLoading={isClassesLoading}
      />

      {/* 2-Column Curriculum & Faculty Spotlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubjectsOverview
          subjects={subjects}
          classes={classes}
          isLoading={isSubjectsLoading || isClassesLoading}
        />
        <TeachersSpotlight
          teachers={teachers}
          classes={classes}
          isLoading={isTeachersLoading || isClassesLoading}
        />
      </div>
    </ListView>
  );
};

export default Dashboard;