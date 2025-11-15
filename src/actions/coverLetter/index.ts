"use server";

import { genAi } from "@/lib/genAI";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type GenerateCoverLetterProps = {
  jobTitle: string;
  company: string;
  jobDescription: string;
};

export const generateCoverLetter = async (data: GenerateCoverLetterProps) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${
    data.company
  }.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.yearsOfExperience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

  try {
    const response = await genAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const content = response.text?.trim() || "";

    const coverLetter = await prisma.coverLetter.create({
      data: {
        content,
        companyName: data.company,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter: ", error);
    throw new Error("Failed to generate cover letter. Please try again later.");
  }
};

export const getCoverLetters = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await prisma.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCoverLetter = async (id: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await prisma.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
};

export const deleteCoverLetter = async (id: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await prisma.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
};
