"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFetch } from "@/hooks";
import { Question } from "@/types";
import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { toast } from "sonner";
import AssessmentResult from "./assessment-result";
import { type AssessmentResult as AssessmentResultType } from "@/generated/prisma";
import { Loader } from "lucide-react";

type SaveAssessmentPayload = {
  questions: Question[];
  answers: string[];
  score: number;
};

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const {
    loading: loadingAssessment,
    fn: getAssessmentFn,
    data: assessment,
    error: getAssessmentError,
  } = useFetch<Question[], null>("/api/assessment", { method: "GET" });

  const {
    loading: savingAssessment,
    fn: saveAssessmentFn,
    data: savedAssessment,
    setData: setSavedAssessment,
    error: saveAssessmentError,
  } = useFetch<AssessmentResultType, SaveAssessmentPayload>("/api/assessment");

  useEffect(() => {
    if (assessment) {
      setAnswers(new Array(assessment.length).fill(null));
    }
  }, [assessment]);

  useEffect(() => {
    if (saveAssessmentError) toast.error(saveAssessmentError);
  }, [saveAssessmentError]);

  useEffect(() => {
    if (getAssessmentError) toast.error(getAssessmentError);
  }, [getAssessmentError]);

  const setAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const startNewAssessment = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    getAssessmentFn();
    setSavedAssessment(null);
  };

  const calculateScore = () => {
    if (!assessment) return 0;
    let correct = 0;
    answers.forEach((answer, idx) => {
      if (answer === assessment[idx].correctAnswer) correct++;
    });
    return (correct / assessment.length) * 100;
  };

  const endAssessment = async () => {
    if (!assessment) return;

    const score = calculateScore();
    try {
      await saveAssessmentFn({ questions: assessment, answers, score });
      toast.success("Assessment completed!");
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Failed to save assessment results"
      );
    }
  };

  const handleNext = () => {
    if (!assessment) return;
    if (currentQuestion < assessment.length - 1) {
      setCurrentQuestion((p) => p + 1);
      setShowExplanation(false);
    } else {
      endAssessment();
    }
  };

  const generateAssessment = () => {
    getAssessmentFn();
  };

  const question = assessment?.[currentQuestion];

  return loadingAssessment ? (
    <SyncLoader className="mt-4 w-full" color="gray" />
  ) : savedAssessment ? (
    <div className="mx-2">
      <AssessmentResult
        result={savedAssessment}
        onStartNew={startNewAssessment}
      />
    </div>
  ) : assessment && question ? (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {assessment.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>
        <RadioGroup
          onValueChange={setAnswer}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {question.options.map((option, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${idx}`} />
              <Label htmlFor={`option-${idx}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
          >
            Show Explanation
          </Button>
        )}

        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingAssessment}
          className="ml-auto"
        >
          {savingAssessment && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          {currentQuestion < assessment.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  ) : (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>Ready to test your knowledge?</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This assessment contains 10 questions specific to your industry and
          skills. Take your time and choose the best answer for each question.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={generateAssessment} className="w-full">
          Start Assessment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Assessment;
