import { NextResponse } from "next/server";
import { generateCoverLetter } from "@/actions/coverLetter";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = await generateCoverLetter(data);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error(err);
    const error = err instanceof Error ? err : Error(err as string);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save resume" },
      { status: 500 }
    );
  }
}
