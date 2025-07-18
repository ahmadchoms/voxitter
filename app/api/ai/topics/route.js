import { aiService } from "@/lib/gemini/ai";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Konten diperlukan untuk rekomendasi topik." },
        { status: 400 }
      );
    }

    const { data, error } = await aiService.getRecommendedTopics(content);

    if (error) {
      console.error("AI Topic Error:", error);
      return NextResponse.json({ error: error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error in AI topics API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
