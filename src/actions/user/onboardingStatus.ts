import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getOnboardingStatus = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      yearsOfExperience: true,
      bio: true,
      skills: true,
    },
  });
  if (!user) throw new Error("User not found");

  const isOnboarded =
    !!user.industry &&
    user.yearsOfExperience !== null &&
    !!user.bio &&
    user.skills.length > 0;

  return { isOnboarded, user };
};
