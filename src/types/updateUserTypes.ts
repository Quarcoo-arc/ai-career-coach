import { User } from "@/generated/prisma";

export type UpdateUserData = {
  industry: string;
  yearsOfExperience: number;
  bio?: string;
  skills?: string[];
};

export interface UpdateUserReturnType extends User {
  success: boolean;
}
