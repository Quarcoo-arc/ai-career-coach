import { Experience } from "@/schema/resume";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const experienceToMarkdown = (
  experiences: Experience[],
  type: string
) => {
  if (!experiences.length) return "";
  return (
    `## ${type}\n\n` +
    experiences
      .map((experience) => {
        const dateRange = experience.current
          ? `${experience.startDate} - Present`
          : `${experience.startDate} - ${experience.endDate}`;
        return `### ${experience.title} @ ${experience.organization}\n${dateRange}\n\n${experience.description}`;
      })
      .join("\n\n")
  );
};
