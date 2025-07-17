import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { likesService } from "@/lib/supabase/likes";
import { authOptions } from "@/lib/auth/options";

export async function POST(request, { params }) {
  const postId = params.id;

  try {
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

    const { data: existingLike, error: findError } =
      await likesService.findLike(postId, userId);

    if (findError) {
      return NextResponse.json(
        { message: "Failed to check like status." },
        { status: 500 }
      );
    }

    let isLiked;

    if (existingLike) {
      const { success, error } = await likesService.deleteLike(
        postId,
        existingLike.id
      );
      if (!success) {
        throw new Error(error || "Failed to unlike post.");
      }
      isLiked = false;
    } else {
      const { success, error } = await likesService.createLike(
        postId,
        userId
      );
      if (!success) {
        throw new Error(error || "Failed to like post.");
      }
      isLiked = true;
    }

    return NextResponse.json(
      {
        success: true,
        isLiked: isLiked,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const userId = params.id;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await likesService.getLikedPosts(userId);

    if (error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
