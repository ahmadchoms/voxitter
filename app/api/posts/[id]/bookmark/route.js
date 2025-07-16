import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { bookmarksService } from "@/lib/supabase/bookmarks";
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

    const { data: existingBookmark, error: findError } =
      await bookmarksService.findBookmark(postId, userId);

    if (findError) {
      return NextResponse.json(
        { message: "Failed to check bookmark status." },
        { status: 500 }
      );
    }

    let isBookmarked;
    let operationSuccess;
    let operationError;

    if (existingBookmark) {
      const { success, error } = await bookmarksService.deleteBookmark(
        existingBookmark.id
      );
      operationSuccess = success;
      operationError = error;
      isBookmarked = false;
    } else {
      const { success, error } = await bookmarksService.createBookmark(
        postId,
        userId
      );
      operationSuccess = success;
      operationError = error;
      isBookmarked = true;
    }

    if (!operationSuccess) {
      return NextResponse.json(
        {
          message: operationError || "Failed to toggle bookmark on the server.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        isBookmarked: isBookmarked,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
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
    const { data, error } = await bookmarksService.getBookmarkedPosts(userId);

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
