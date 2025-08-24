import { industries } from "@/data";
import React from "react";
import { OnboardingForm } from "./_components";

const Onboarding = () => {
  return (
    <div>
      <OnboardingForm industries={industries} />
    </div>
  );
};

export default Onboarding;
