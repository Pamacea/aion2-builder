import { signOut } from "@/auth";

export async function GET() {
  return await signOut({ redirectTo: "/" });
}

export async function POST() {
  return await signOut({ redirectTo: "/" });
}

