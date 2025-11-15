import { getUserIndustryInsights } from "@/actions/industryInsights/getIndustryInsights";
import { getOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";
import DashboardView from "./_components/dashboard-view";

const DashboardPage = async () => {
  const { isOnboarded } = await getOnboardingStatus();
  const insights = await getUserIndustryInsights();

  if (!isOnboarded) {
    redirect("/onboarding");
  }
  return <DashboardView insights={insights} />;
};

export default DashboardPage;
