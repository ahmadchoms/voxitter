import { supabase } from "@/lib/supabase/client";
import { topicRatingSchema } from "@/lib/validation/ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const validationResult = topicRatingSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { topicId, userId, rating } = validationResult.data;

    const { data, error } = await supabase
      .from("topic_ratings")
      .upsert(
        {
          topic_id: topicId,
          user_id: userId,
          rating: rating,
        },
        {
          onConflict: ["topic_id", "user_id"],
        }
      )
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data[0] }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/ai/trending/rate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
