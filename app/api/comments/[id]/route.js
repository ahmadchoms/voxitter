import { commentsService } from "@/lib/supabase/comments";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const commentId = params?.id;

  if (!commentId) {
    return NextResponse.json(
      { error: "Comment ID tidak ditemukan" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID diperlukan" },
        { status: 400 }
      );
    }

    const result = await commentsService.deleteComment(commentId, user_id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      message: "Komentar berhasil dihapus",
      data: result.data,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete comment" },
      { status: 500 }
    );
  }
}