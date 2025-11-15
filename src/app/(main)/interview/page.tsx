import { getAssessmentResults } from "@/actions/assessment";
import React from "react";
import StatsCard from "./_components/stats-card";
import PerformanceChart from "./_components/performance-chart";
import AssessmentList from "./_components/assessment-list";

const InterviewPage = async () => {
  const assessments = await getAssessmentResults();

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
        <StatsCard assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <AssessmentList assessments={assessments} />
      </div>
    </>
  );
};

export default InterviewPage;
