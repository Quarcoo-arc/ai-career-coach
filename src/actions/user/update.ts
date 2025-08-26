"use server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type UpdateUserData = {
  industry: string;
  yearsOfExperience: number;
  bio: string;
  skills: string[];
};

export const updateUser = async (data: UpdateUserData) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        let industryInsight = await tx.industryInsight.findUnique({
          where: { industry: data.industry },
        });

        if (!industryInsight) {
          industryInsight = await tx.industryInsight.create({
            data: {
              industry: data.industry,
              salaryRanges: [],
              growthRate: 0,
              demandLevel: "MEDIUM",
              topSkills: [],
              marketOutlook: "NEUTRAL",
              trends: [],
              recommendedSkills: [],
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }, // next update in 7 days
          });
        }

        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            industry: data.industry,
            yearsOfExperience: data.yearsOfExperience,
            bio: data.bio,
            skills: data.skills,
          },
        });
        return { user: updatedUser, industryInsight };
      },
      { timeout: 10000 }
    ); // 10 seconds timeout, default is 5 seconds
    return result.user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating user:", error.message);
    } else {
      console.error("Unknown error updating user");
    }
    throw new Error("Failed to update user details");
  }
};
