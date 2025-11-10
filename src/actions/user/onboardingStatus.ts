import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getOnboardingStatus = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
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
      user.skills.length > 0;

    return { isOnboarded, user };
  } catch (err) {
    const error = err instanceof Error ? err : Error(err as string);
    console.error("Error fetching user onboarding status:", error.message);
    throw new Error("Failed to fetch user onboarding status");
  }
};
