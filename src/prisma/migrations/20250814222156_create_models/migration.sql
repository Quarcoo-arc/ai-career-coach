-- CreateEnum
CREATE TYPE "public"."DemandLevel" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "public"."MarketOutlook" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "industry" TEXT,
    "bio" TEXT,
    "yearsOfExperience" INTEGER,
    "skills" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AssessmentResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "questions" JSONB[],
    "category" TEXT NOT NULL,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CoverLetter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "jobDescription" TEXT,
    "jobTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoverLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IndustryInsight" (
    "id" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "salaryRanges" JSONB[],
    "growthRate" DOUBLE PRECISION NOT NULL,
    "demandLevel" "public"."DemandLevel" NOT NULL,
    "topSkills" TEXT[],
    "marketOutlook" "public"."MarketOutlook" NOT NULL,
    "trends" TEXT[],
    "recommendedSkills" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nextUpdate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndustryInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "public"."User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "AssessmentResult_userId_idx" ON "public"."AssessmentResult"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Resume_userId_key" ON "public"."Resume"("userId");

-- CreateIndex
CREATE INDEX "CoverLetter_userId_idx" ON "public"."CoverLetter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "IndustryInsight_industry_key" ON "public"."IndustryInsight"("industry");

-- CreateIndex
CREATE INDEX "IndustryInsight_industry_idx" ON "public"."IndustryInsight"("industry");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_industry_fkey" FOREIGN KEY ("industry") REFERENCES "public"."IndustryInsight"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssessmentResult" ADD CONSTRAINT "AssessmentResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CoverLetter" ADD CONSTRAINT "CoverLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
