import { signIn } from "@/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return await signIn("discord", { redirectTo: "/" });
}

export async function POST(request: NextRequest) {
  return await signIn("discord", { redirectTo: "/" });
}

