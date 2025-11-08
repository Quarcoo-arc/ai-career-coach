"use server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAi = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const generateAiInsights = async (industry: string) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "HIGH" | "MEDIUM" | "LOW",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
            "trends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
    `;

  const response = await genAi.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  const text = response.text;
  console.log({ text });
  const cleanedText = text?.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText ?? "{}");
};

export const getUserIndustryInsights = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });
  if (!user) throw new Error("User not found");

  if (!user.industry)
    throw new Error("User industry is required to get industry insights.");

  if (!user.industryInsight) {
    const insights = await generateAiInsights(user.industry);

    const industryInsight = await prisma.industryInsight.create({
      data: {
        industry: user.industry || "",
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
};
