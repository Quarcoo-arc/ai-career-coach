import z from "zod";

export const coverLetterSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});

export type CreateCoverLetter = z.infer<typeof coverLetterSchema>;
