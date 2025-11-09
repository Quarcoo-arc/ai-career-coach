import prisma from "../prisma";
import { inngest } from "./client";
import { genAi } from "../genAI";
import { getInsightGenerationPrompt } from "@/actions/industryInsights/getIndustryInsights";

// Cron Job for updating industry insights, runs every sunday at midnight
export const generateIndustryInsights = inngest.createFunction(
  { id: "generate-industry-insights", name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" },
  async ({ step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return await prisma.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industries) {
      const prompt = await getInsightGenerationPrompt(industry);
      const response = await step.ai.wrap(
        "gemini",
        async (p) =>
          await genAi.models.generateContent({
            model: "gemini-2.5-flash",
            contents: p,
          }),
        prompt
      );

      const text =
        response.candidates?.at(0)?.content?.parts?.at(0)?.text || "";
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

      const insights = JSON.parse(cleanedText);

      await step.run(`update-${industry}-insights`, async () => {
        await prisma.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);
