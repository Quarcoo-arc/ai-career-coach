import { z } from "zod";

export const onboardingSchema = z.object({
  industry: z.string({ error: "Please select an industry" }),
  subIndustry: z.string({ error: "Please select a specialization" }),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  yearsOfExperience: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number({
          error:
            "Please enter the number of years of experience you have in the selected industry",
        })
        .min(0, "Years of experience must be at least 0")
        .max(50, "Years of experience cannot exceed 50")
    ),
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

export type OnboardingFormInputs = z.infer<typeof onboardingSchema>;
