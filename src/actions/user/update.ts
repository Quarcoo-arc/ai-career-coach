"use server";
import prisma from "@/lib/prisma";
import { UpdateUserData, UpdateUserReturnType } from "@/types/updateUserTypes";
import { auth } from "@clerk/nextjs/server";
import { generateAiInsights } from "../industryInsights/getIndustryInsights";

export const updateUser = async (
  data: UpdateUserData
): Promise<UpdateUserReturnType> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

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
          const insights = await generateAiInsights(data.industry);

          industryInsight = await prisma.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // update in 7 days
            },
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
      { timeout: 15000 }
    ); // 15 seconds timeout, default is 5 seconds
    return { success: true, ...result.user };
  } catch (error) {
    const err = error instanceof Error ? error : Error(error as string);
    console.error("Error updating user:", err.message);
    throw new Error("Failed to update user profile: " + err.message);
  }
};
