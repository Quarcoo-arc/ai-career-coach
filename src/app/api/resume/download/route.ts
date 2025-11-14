import { NextResponse } from "next/server";
import { downloadResume } from "@/actions/resume";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const pdfBuffer = await downloadResume(content);
    // ensure we have a plain ArrayBuffer-backed Uint8Array (avoid SharedArrayBuffer types)
    const uint8 =
      pdfBuffer instanceof Uint8Array
        ? pdfBuffer.slice()
        : new Uint8Array(pdfBuffer).slice();
    // convert the Uint8Array to a Blob so it matches BodyInit
    const pdfBlob = new Blob([uint8], { type: "application/pdf" });
    return new NextResponse(pdfBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
      },
    });
  } catch (err: unknown) {
    console.error(err);
    const error = err instanceof Error ? err : Error(err as string);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
