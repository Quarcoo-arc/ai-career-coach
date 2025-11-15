import { industries } from "@/data";
import React from "react";
import { OnboardingForm } from "./_components";
import { getOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

const OnboardingPage = async () => {
  const { isOnboarded } = await getOnboardingStatus();
  if (isOnboarded) {
    redirect("/dashboard");
  }
  return <OnboardingForm industries={industries} />;
};

export default OnboardingPage;
