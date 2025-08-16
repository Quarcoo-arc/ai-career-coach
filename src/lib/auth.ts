import { currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";

export const getCurrentUser = async () => {
  const user = await currentUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!dbUser) {
    // If the user does not exist in the database, create a new user record
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      },
    });
    return newUser;
  }

  return dbUser || null;
};
