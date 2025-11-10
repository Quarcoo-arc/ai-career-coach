import { NextResponse } from "next/server";
import { updateUser } from "@/actions/user";

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const result = await updateUser(data);
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
