import { authOptions } from "@/lib/auth/options";
import { commentsService } from "@/lib/supabase/comments";
import { commentSchema } from "@/lib/validation/comment";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const postId = params?.id;
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get("offset") || "0");
  const limit = parseInt(searchParams.get("limit") || "25");

  if (!postId) {
    return NextResponse.json(
      { error: "Post ID tidak ditemukan" },
      { status: 400 }
    );
  }

  try {
    const result = await commentsService.getCommentsByPost(
      postId,
      offset,
      limit
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  const postId = params?.id;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!postId) {
    return NextResponse.json(
      { error: "Post ID tidak ditemukan" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();

    const validatedData = commentSchema.parse({
      ...body,
      post_id: postId,
      user_id: user?.id,
    });

    const result = await commentsService.createComment(validatedData);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Data tidak valid", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to add comment" },
      { status: 500 }
    );
  }
}
