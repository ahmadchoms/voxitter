import { NextResponse } from "next/server";
import { postsService } from "@/lib/supabase/posts";
import { postSchema } from "@/lib/validation/post";

export async function GET(request, { params }) {
  try {
    const result = await postsService.getPostById(params.id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const validatedData = postSchema.parse(body);

    const result = await postsService.updatePost(params.id, validatedData);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const result = await postsService.deletePost(params.id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
