type Industry = {
  id: string;
  name: string;
  subIndustries: string[];
};

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type QuestionWithResponse = {
  question: string;
  isCorrect: boolean;
  userAnswer: string;
  explanation: string;
  answer: string;
};

type Industries = Industry[];

export type { Industry, Industries, Question, QuestionWithResponse };
