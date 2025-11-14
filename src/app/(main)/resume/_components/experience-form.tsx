"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks";
import { Experience, experienceSchema } from "@/schema/resume";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Loader, PlusCircle, Sparkles, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const formatDisplayDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

interface ExperienceFormProps {
  type: "experience" | "education" | "project";
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

interface ImproveWithAIProps {
  type: "experience" | "education" | "project";
  description: string;
}

const ExperienceForm = ({
  type,
  experiences,
  onChange,
}: ExperienceFormProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  const addExperience = handleSubmit((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    onChange([...experiences, formattedEntry]);

    reset();
    setIsAdding(false);
  });

  const deleteExperience = (index: number) => {
    const newExperiences = experiences.filter((_, i) => i !== index);
    onChange(newExperiences);
  };

  const {
    loading: isImproving,
    fn: improveWithAI,
    data: improvedContent,
    error: improveError,
  } = useFetch<{ result: string }, ImproveWithAIProps>(
    "/api/resume/improve-with-ai"
  );

  // Add this effect to handle the improvement result
  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent.result);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const improveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAI({
      description,
      type,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {experiences.map((item, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title} @ {item.organization}
              </CardTitle>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => deleteExperience(idx)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.current
                  ? `${item.startDate} - Present`
                  : `${item.startDate} - ${item.endDate}`}
              </p>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}

        {isAdding ? (
          <Card>
            <CardHeader>
              <CardTitle>Add {type}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    placeholder={
                      type === "education"
                        ? "Program"
                        : type === "project"
                        ? "Project Name"
                        : "Title/Position"
                    }
                    {...register("title")}
                    aria-invalid={!!errors.title}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder={
                      type === "education"
                        ? "Institution"
                        : "Organization/Company"
                    }
                    {...register("organization")}
                    aria-invalid={!!errors.organization}
                  />
                  {errors.organization && (
                    <p className="text-sm text-red-500">
                      {errors.organization.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    type="month"
                    {...register("startDate")}
                    aria-invalid={!!errors.startDate}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-500">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="month"
                    {...register("endDate")}
                    disabled={current}
                    aria-invalid={!!errors.endDate}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-500">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="current"
                  {...register("current")}
                  onChange={(e) => {
                    setValue("current", e.target.checked);
                    if (e.target.checked) {
                      setValue("endDate", "");
                    }
                  }}
                />
                <label htmlFor="current">Current {type}</label>
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder={`Description of your ${type}`}
                  className="h-32"
                  {...register("description")}
                  aria-invalid={!!errors.description}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={improveDescription}
                disabled={isImproving || !watch("description")}
              >
                {isImproving ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Improving...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Improve with AI
                  </>
                )}
              </Button>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setIsAdding(false);
                }}
              >
                Cancel
              </Button>
              <Button type="button" onClick={addExperience}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Button
            className="w-full"
            variant="outline"
            onClick={() => setIsAdding(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add {type}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExperienceForm;
