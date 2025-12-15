import { signOut } from "@/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  return await signOut({ redirectTo: callbackUrl });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  return await signOut({ redirectTo: callbackUrl });
}

