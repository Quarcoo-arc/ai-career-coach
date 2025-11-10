"use server";

import { genAi } from "@/lib/genAI";
import prisma from "@/lib/prisma";
import { Question } from "@/types";
import { auth } from "@clerk/nextjs/server";

export const generateAssessment = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const response = await genAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const text = response.text || "";
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const assessment = JSON.parse(cleanedText);

    return assessment?.questions as Question[];
  } catch (error) {
    console.error("Error generating assessment: ", error);
    throw new Error("Failed to generate assessment questions");
  }
};

export const saveAssessmentResult = async (
  questions: Question[],
  answers: string[],
  score: number
) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const results = questions.map((q, idx) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[idx],
    isCorrect: q.correctAnswer === answers[idx],
    explanation: q.explanation,
  }));

  const mistakes = results.filter((q) => !q.isCorrect);

  // Generate improvement tips if there are mistakes
  let feedback = null;

  if (mistakes) {
    const wrongQuestions = mistakes
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const prompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestions}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const response = await genAi.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      feedback = response.text?.trim() || "";
      console.log({ improvementTip: feedback });
    } catch (error) {
      console.error("Error generating improvement tip: ", error);
    }
  }

  // Save Assessment result in db
  try {
    const assessment = await prisma.assessmentResult.create({
      data: {
        userId: user.id,
        score: score,
        questions: questions,
        category: "TECHNICAL",
        feedback,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving assessment result: ", error);
    throw new Error("Failed to save assessment result");
  }
};
