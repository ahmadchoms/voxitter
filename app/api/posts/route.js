import { NextResponse } from "next/server";
import { postsService } from "@/lib/supabase/posts";
import { postSchema } from "@/lib/validation/post";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const offset = Number.parseInt(searchParams.get("offset") || "0");
    const userId = searchParams.get("user_id");
    const categoryId = searchParams.get("category_id");
    const viewerId = searchParams.get("viewer_id");

    let result;

    if (userId) {
      result = await postsService.getPostsByUser(userId, offset, limit);
    } else if (categoryId) {
      result = await postsService.getPostsByCategory(categoryId, offset, limit, userId);
    } else {
      result = await postsService.getPosts(offset, limit, viewerId);
    }

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validatedData = postSchema.parse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          errors: validatedData.error.errors.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { user_id, content, category_ids, image_urls } = validatedData.data;

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await postsService.createPost({
      user_id,
      content,
      category_ids,
      image_urls,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
