import { NextResponse } from "next/server";
import getCurrentUser from "@/services/getCurrentUser";

export async function GET() {
  const currentUser = await getCurrentUser();
  return NextResponse.json(currentUser);
}
