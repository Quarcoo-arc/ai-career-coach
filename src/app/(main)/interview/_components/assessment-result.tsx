"use client";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type AssessmentResult } from "@/generated/prisma";
import { QuestionWithResponse } from "@/types";
import { Trophy, CheckCircle2, XCircle } from "lucide-react";
import React from "react";

interface IProps {
  result: AssessmentResult;
  hideStartNew?: boolean;
  onStartNew: () => void;
}

const AssessmentResult = ({
  result,
  hideStartNew = false,
  onStartNew,
}: IProps) => {
  return result ? (
    <div className="mx-auto">
      <h1 className="flex items-center gap-2 text-3xl gradient-title">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Assessment Results
      </h1>

      <CardContent className="space-y-6">
        {/* Score */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">{result.score.toFixed(1)}%</h3>
          <Progress value={result.score} className="w-full" />
        </div>

        {/* Feedback */}
        {result.feedback && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">Improvement Tip:</p>
            <p className="text-muted-foreground">{result.feedback}</p>
          </div>
        )}

        {/* Review Questions */}
        <div className="space-y-4">
          <h3 className="font-medium">Question Review</h3>
          {(result.questions as unknown as QuestionWithResponse[]).map(
            (q, idx) =>
              q && (
                <div key={idx} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{q.question}</p>
                    {q.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Your answer: {q.userAnswer}</p>
                    {!q.isCorrect && <p>Correct answer: {q.answer}</p>}
                  </div>
                  <div className="text-sm bg-muted p-2 rounded">
                    <p className="font-medium">Explanation:</p>
                    <p>{q.explanation}</p>
                  </div>
                </div>
              )
          )}
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter>
          <Button onClick={onStartNew} className="w-full">
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  ) : null;
};

export default AssessmentResult;
