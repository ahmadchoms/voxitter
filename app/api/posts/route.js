import { NextResponse } from "next/server";
import { postsService } from "@/lib/supabase/posts";
import { createPostSchema } from "@/lib/validation/posts";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const offset = Number.parseInt(searchParams.get("offset") || "0");
    const userId = searchParams.get("user_id");
    const categoryId = searchParams.get("category_id");

    let result;

    if (userId) {
      result = await postsService.getPostsByUser(userId, offset, limit);
    } else if (categoryId) {
      result = await postsService.getPostsByCategory(categoryId, offset, limit);
    } else {
      result = await postsService.getPosts(offset, limit);
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
    const validatedData = createPostSchema.parse(body);

    const result = await postsService.createPost(validatedData);

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
