import { genAi } from "@/lib/genAI";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

export const saveResume = async (content: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    // Create / Update resume
    const resume = await prisma.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
};

export const getResume = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await prisma.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
};

export const improveWithAI = async ({
  description,
  type,
}: {
  description: string;
  type: string;
}) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${description}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const response = await genAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
};

const getBrowser = async () => {
  if (process.env.NODE_ENV === "production") {
    return await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: "shell",
    });
  }
  return await puppeteer.launch();
};

export const downloadResume = async (content: string) => {
  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    const styledHTML = `
    <style>
        * {
            font-family: Roboto, Helvetica, Arial, sans-serif;
        } 
        [aria-hidden=true] {
            display: none;
        }
    </style>
    ${content}
    `;
    await page.setContent(styledHTML, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
    });
    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
