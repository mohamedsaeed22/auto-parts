import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { google_id } = body;

    if (!google_id) {
      return NextResponse.json(
        { error: "Google ID is required" },
        { status: 400 }
      );
    }

    // Since you're calling the backend directly from the frontend,
    // this API route is not needed. You can remove this file or
    // use it for additional processing if needed.

    return NextResponse.json({
      message:
        "This endpoint is not needed since you're calling the backend directly",
      google_id: google_id,
    });
  } catch (error) {
    console.error("Google login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
