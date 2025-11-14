import z from "zod";

export const contactSchema = z.object({
  email: z.email("Invalid email address"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

export const experienceSchema = z
  .object({
    organization: z.string().min(1, "Organization is required"),
    title: z.string().min(1, "Title is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    current: z.boolean().default(false),
  })
  .refine((data) => data.current || data.endDate, {
    message: "End date is required unless this is your current position",
    path: ["endDate"],
  });

export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z.string().min(1, "Professional summary is required"),
  skills: z.string().min(1, "Skills are required"),
  experience: z.array(experienceSchema),
  education: z.array(experienceSchema),
  projects: z.array(experienceSchema),
});

export type Experience = z.input<typeof experienceSchema>;
