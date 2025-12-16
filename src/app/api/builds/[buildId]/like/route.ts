import { toggleLikeBuild } from "@/actions/buildActions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ buildId: string }> }
) {
  try {
    const { buildId: buildIdParam } = await params;
    const buildId = parseInt(buildIdParam);
    if (isNaN(buildId)) {
      return NextResponse.json(
        { error: "Invalid build ID" },
        { status: 400 }
      );
    }

    const result = await toggleLikeBuild(buildId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error toggling like:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to toggle like";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

