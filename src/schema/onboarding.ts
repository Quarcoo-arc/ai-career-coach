import { z } from "zod";

export const onboardingSchema = z.object({
  industry: z.string({ error: "Industry is required" }),
  subIndustry: z.string({ error: "Sub-industry is required" }),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
  yearsOfExperience: z
    .number({ error: "Years of experience must be a number" })
    .min(0, "Years of experience must be at least 0")
    .max(50, "Years of experience must be at most 50"),
  skills: z
    .string()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined
    )
    .optional(),
});
