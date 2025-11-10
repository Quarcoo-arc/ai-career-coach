import { NextResponse } from "next/server";
import { generateAssessment, saveAssessmentResult } from "@/actions/assessment";

export async function POST(req: Request) {
  try {
    const { questions, answers, score } = await req.json();
    const result = await saveAssessmentResult(questions, answers, score);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error(err);
    const error = err instanceof Error ? err : Error(err as string);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await generateAssessment();
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    const error = err instanceof Error ? err : Error(err as string);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to generate assessment",
      },
      { status: 500 }
    );
  }
}
