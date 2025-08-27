import { getOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const { isOnboarded } = await getOnboardingStatus();
  if (!isOnboarded) {
    redirect("/onboarding");
  }
  return <div>Dashboard</div>;
};

export default Dashboard;
