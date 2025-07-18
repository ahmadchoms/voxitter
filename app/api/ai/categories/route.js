import { NextResponse } from "next/server";
import { requestSchema } from "@/lib/validation/ai";
import { aiService } from "@/lib/gemini/ai";

export async function POST(req) {
  try {
    const body = await req.json();
    const validationResult = requestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { content } = validationResult.data;

    const { data: suggestedCategoryIds, error: aiError } =
      await aiService.getSuggestedCategories(content);

    if (aiError) {
      return NextResponse.json(
        { error: `Error auto-generating categories: ${aiError}` },
        { status: 500 }
      );
    }

    return NextResponse.json(suggestedCategoryIds, { status: 200 });
  } catch (error) {
    console.error("Error in /api/ai/categories route:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  }
}
