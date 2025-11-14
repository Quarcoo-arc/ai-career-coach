"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks";
import { experienceToMarkdown } from "@/lib/utils";
import { resumeSchema } from "@/schema/resume";
import { useUser } from "@clerk/nextjs";
import MDEditor, { type PreviewType } from "@uiw/react-md-editor";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader,
  Monitor,
  Save,
} from "lucide-react";
import React, { useRef, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ExperienceForm from "./experience-form";
import { toast } from "sonner";
import { Resume } from "@/generated/prisma";

const ResumeBuilder = ({ initialContent }: { initialContent: string }) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeMode, setResumeMode] = useState<PreviewType>("preview");
  const [previewContent, setPreviewContent] = useState(initialContent);

  const { user } = useUser();
  const markdownElement = useRef<HTMLDivElement | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    data: savedResume,
    error: saveResumeError,
    loading: savingResume,
    fn: saveResumeFn,
  } = useFetch<Resume, { content: string }>("/api/resume");

  // Watch form fields for preview updates
  const formValues = watch();

  // View resume if it has already been created
  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  const getContactMarkdown = useCallback(() => {
    const { contactInfo } = formValues;
    const contactDetails = [];
    if (contactInfo.email) contactDetails.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) contactDetails.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      contactDetails.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter)
      contactDetails.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return contactDetails.length > 0
      ? `## <div align="center">${user?.fullName || "Full Name"}</div>
        \n\n<div align="center">\n\n${contactDetails.join(" | ")}\n\n</div>
        <hr/>`
      : "";
  }, [formValues, user?.fullName]);

  const getCombinedContent = useCallback(() => {
    const { summary, skills, experience, education, projects } = formValues;

    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      experienceToMarkdown(experience, "Work Experience"),
      experienceToMarkdown(education, "Education"),
      experienceToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [formValues, getContactMarkdown]);

  // Update preview content when form values change
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab, getCombinedContent, initialContent]);

  // Saving Resume
  useEffect(() => {
    if (savedResume && !savingResume) {
      toast.success("Resume saved successfully!");
    }
    if (saveResumeError) {
      toast.error(saveResumeError || "Failed to save resume");
    }
  }, [saveResumeError, savedResume, savingResume]);

  const onSubmit = async () => {
    try {
      await saveResumeFn({ content: previewContent });
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const content = markdownElement.current?.innerHTML;
      if (!content) {
        toast.info("The PDF has no content");
        return;
      }
      const response = await fetch("/api/resume/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        toast.error("Failed to generate PDF");
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        <div className="space-x-2">
          <Button
            variant="destructive"
            onClick={handleSubmit(onSubmit)}
            disabled={savingResume}
          >
            {savingResume ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <form
            onSubmit={handleSubmit(onSubmit)}
            // Prevent native form resets from clearing uncontrolled registered inputs.
            onReset={(e) => e.preventDefault()}
            className="space-y-8"
          >
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="abc@xyz.com"
                    aria-invalid={!!errors.contactInfo?.email}
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+233 244 567 890"
                  />
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">X Profile</label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://x.com/your-handle"
                  />
                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field, fieldState }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary..."
                    aria-invalid={fieldState.invalid}
                  />
                )}
              />
              {errors.summary && (
                <p className="text-sm text-red-500">{errors.summary.message}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field, fieldState }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your key skills..."
                    aria-invalid={fieldState.invalid}
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <ExperienceForm
                    type="experience"
                    experiences={field.value}
                    onChange={(v) => {
                      field.onChange(v);
                    }}
                  />
                )}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <ExperienceForm
                    type="education"
                    experiences={field.value}
                    onChange={(v) => {
                      field.onChange(v);
                    }}
                  />
                )}
              />
              {errors.education && (
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>

            {/* Projects */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <ExperienceForm
                    type="project"
                    experiences={field.value}
                    onChange={(v) => {
                      field.onChange(v);
                    }}
                  />
                )}
              />
              {errors.projects && (
                <p className="text-sm text-red-500">
                  {errors.projects.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          <Button
            variant="link"
            type="button"
            className="mb-2"
            onClick={() =>
              setResumeMode(resumeMode === "preview" ? "edit" : "preview")
            }
          >
            {resumeMode === "preview" ? (
              <>
                <Edit className="h-4 w-4" />
                Edit Resume
              </>
            ) : (
              <>
                <Monitor className="h-4 w-4" />
                Show Preview
              </>
            )}
          </Button>
          {resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose edited markdown if you update the form.
              </span>
            </div>
          )}
          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={(value?: string) => setPreviewContent(value ?? "")}
              height={800}
              preview={resumeMode}
            />
          </div>
          <div className="hidden">
            <div ref={markdownElement}>
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "black",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
