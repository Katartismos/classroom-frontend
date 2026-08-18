import React from "react";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { useBack, useNavigation } from "@refinedev/core";
import {
  BookOpen,
  ArrowLeft,
  Loader2,
  Sparkles,
  Building2,
  Hash,
  FileText,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { subjectSchema } from "@/lib/schema";
import { DEPARTMENT_OPTIONS } from "@/constants";
import z from "zod";

type SubjectFormValues = z.infer<typeof subjectSchema>;

const SubjectsCreate = () => {
  const back = useBack();
  const { list } = useNavigation();

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    refineCoreProps: {
      resource: "subjects",
      action: "create",
      redirect: "list",
    },
    defaultValues: {
      name: "",
      code: "",
      department: "Computer Science",
      description: "",
    },
  });

  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
    watch,
    setValue,
  } = form;

  const watchedName = watch("name");
  const watchedCode = watch("code");
  const watchedDepartment = watch("department");
  const watchedDescription = watch("description");

  // Helper to auto-suggest subject code from name
  const handleAutoSuggestCode = () => {
    if (!watchedName) return;
    const words = watchedName.trim().split(/\s+/);
    let generatedCode = "";
    if (words.length === 1) {
      generatedCode = words[0].substring(0, 4).toUpperCase() + "101";
    } else {
      generatedCode =
        words
          .slice(0, 3)
          .map((w) => w[0])
          .join("")
          .toUpperCase() + "101";
    }
    setValue("code", generatedCode, { shouldValidate: true });
  };

  const onSubmit = async (values: SubjectFormValues) => {
    try {
      await onFinish({
        ...values,
        code: values.code.trim().toUpperCase(),
      });
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };

  return (
    <CreateView className="container mx-auto pb-12 px-2 sm:px-4 max-w-5xl">
      <Breadcrumb />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2.5">
            <BookOpen className="h-7 w-7 text-primary" />
            Add New Subject
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Register a curriculum subject and assign it to an academic department
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => back()}
            className="gap-2 text-xs font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Subjects
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <div className="lg:col-span-7">
          <Card className="border border-border/80 bg-card/80 backdrop-blur-xs shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                Subject Information
              </CardTitle>
              <CardDescription className="text-xs">
                Fill in the details below to add the subject to your classroom catalog.
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Subject Name */}
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-primary" />
                          Subject Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Advanced Artificial Intelligence"
                            className="bg-background/60"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[11px]">
                          The full official title of the course module or subject.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Subject Code & Department Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Subject Code */}
                    <FormField
                      control={control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                              <Hash className="h-3.5 w-3.5 text-primary" />
                              Course Code <span className="text-destructive">*</span>
                            </FormLabel>
                            {watchedName && (
                              <button
                                type="button"
                                onClick={handleAutoSuggestCode}
                                className="text-[10px] text-primary hover:underline font-medium flex items-center gap-1 cursor-pointer"
                              >
                                <Sparkles className="h-2.5 w-2.5" />
                                Auto-suggest
                              </button>
                            )}
                          </div>
                          <FormControl>
                            <Input
                              placeholder="e.g. CS401, MATH101"
                              className="font-mono uppercase bg-background/60"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
                            />
                          </FormControl>
                          <FormDescription className="text-[11px]">
                            Unique identifier (e.g. CS101, PHY200).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Department Select */}
                    <FormField
                      control={control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-primary" />
                            Academic Department <span className="text-destructive">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full bg-background/60">
                                <SelectValue placeholder="Select Department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60">
                              {DEPARTMENT_OPTIONS.map((dept) => (
                                <SelectItem key={dept.value} value={dept.value}>
                                  {dept.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-[11px]">
                            Academic division responsible for this subject.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description Textarea */}
                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-primary" />
                          Subject Description <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a comprehensive syllabus overview, course prerequisites, objectives, and academic topics covered..."
                            className="min-h-28 bg-background/60 leading-relaxed text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-[11px]">
                          Detailed scope of the course for teachers and students.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Actions */}
                  <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-border/50">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => back()}
                      disabled={isSubmitting}
                      className="text-xs font-medium"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="gap-2 text-xs font-semibold shadow-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving Subject...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Create Subject
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview & Helpful Tips Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Preview Card */}
          <Card className="border border-border/80 bg-linear-to-br from-primary/5 via-card to-card backdrop-blur-xs shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Live Preview
                </span>
                <Badge variant="outline" className="text-[10px] bg-background/80">
                  Catalog Card
                </Badge>
              </div>
              <CardTitle className="text-base font-bold">
                How it will appear in listings
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-mono text-xs font-extrabold text-primary border border-primary/20 shadow-xs">
                      {watchedCode || "CODE"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground line-clamp-1">
                        {watchedName || "Subject Title Here"}
                      </h4>
                      <Badge variant="secondary" className="text-[10px] mt-0.5">
                        {watchedDepartment || "Department"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {watchedDescription ||
                    "Subject description preview will appear here as you type in the form..."}
                </p>

                <div className="flex items-center justify-between border-t border-border/40 pt-2.5 text-[11px] text-muted-foreground">
                  <span>Status: Ready for class assignment</span>
                  <span className="font-semibold text-primary">0 Classes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Guidelines Card */}
          <Card className="border border-border/80 bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-primary" />
                Guidelines & Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                • <strong>Subject Codes</strong>: Use standard alphanumeric codes
                such as <code className="text-primary font-mono font-semibold">CS101</code>,{" "}
                <code className="text-primary font-mono font-semibold">MATH201</code>, or{" "}
                <code className="text-primary font-mono font-semibold">PHY300</code>.
              </p>
              <p>
                • <strong>Department Linking</strong>: Linking a subject to a department allows you to filter and assign classes effortlessly on the dashboard and classes pages.
              </p>
              <p>
                • <strong>Class Creation</strong>: Once created, this subject will immediately become available in the class creation dropdown.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CreateView>
  );
};

export default SubjectsCreate;