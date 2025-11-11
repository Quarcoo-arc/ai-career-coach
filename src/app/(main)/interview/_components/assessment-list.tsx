"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AssessmentResult } from "@/generated/prisma";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AssessmentResultComponent from "./assessment-result";

const AssessmentList = ({
  assessments,
}: {
  assessments: AssessmentResult[];
}) => {
  const router = useRouter();
  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentResult | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-title text-3xl md:text-4xl">
                Recent Assessments
              </CardTitle>
              <CardDescription>Review your past performances</CardDescription>
            </div>
            <Button onClick={() => router.push("/interview/mock")}>
              Start New Assessment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments?.map((assessment, idx) => (
              <Card
                key={assessment.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedAssessment(assessment)}
              >
                <CardHeader>
                  <CardTitle className="gradient-title text-2xl">
                    Assessment {idx + 1}
                  </CardTitle>
                  <CardDescription className="flex justify-between w-full">
                    <div>Score: {assessment.score.toFixed(1)}%</div>
                    <div>
                      {format(
                        new Date(assessment.createdAt),
                        "MMMM dd, yyyy HH:mm"
                      )}
                    </div>
                  </CardDescription>
                </CardHeader>
                {assessment.feedback && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {assessment.feedback}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedAssessment}
        onOpenChange={() => setSelectedAssessment(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <AssessmentResultComponent
            result={selectedAssessment!}
            hideStartNew
            onStartNew={() => router.push("/interview/mock")}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssessmentList;
