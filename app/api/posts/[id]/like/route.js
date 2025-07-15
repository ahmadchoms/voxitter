import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { likesService } from "@/lib/supabase/likes";
import { authOptions } from "@/lib/auth/options";

export async function GET(req, { params }) {
  const userId = params.id;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await likesService.getLikesPosts(userId);

    if (error) {
      console.error("Error fetching liked posts:", error);
      return NextResponse.json({ error: error }, { status: 500 });
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const postId = params.id;

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  if (!postId) {
    return NextResponse.json(
      { message: "Post ID is required" },
      { status: 400 }
    );
  }

  console.log(`Toggling like for post ID: ${postId} by user ID: ${userId}`);

  const { success, isLiked, newLikesCount, error } =
    await likesService.toggleLike(postId, userId);

  if (!success) {
    return NextResponse.json(
      { message: error || "Failed to toggle like on the server." },
      { status: 500 }
    );
  }

  return NextResponse.json({ isLiked, newLikesCount });
}
