/*
  Warnings:

  - Changed the type of `category` on the `AssessmentResult` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."AssessmentCategory" AS ENUM ('TECHNICAL', 'BEHAVIORAL');

-- AlterTable
ALTER TABLE "public"."AssessmentResult" DROP COLUMN "category",
ADD COLUMN     "category" "public"."AssessmentCategory" NOT NULL;
