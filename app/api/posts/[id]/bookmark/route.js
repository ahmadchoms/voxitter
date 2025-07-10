import { NextResponse } from "next/server";
import { postsService } from "@/lib/supabase/posts";

export async function POST(request, { params }) {
  try {
    const { user_id } = await request.json();

    const result = await postsService.toggleBookmark(params.id, user_id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json(
      { error: "Failed to toggle bookmark" },
      { status: 500 }
    );
  }
}
