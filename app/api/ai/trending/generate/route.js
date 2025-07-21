import { aiService } from "@/lib/gemini/ai";
import { supabase } from "@/lib/supabase/client";

export async function POST(req) {
  try {
    const { data: topics, error: topicsError } =
      await aiService.generateTrendingTopics(15);

    if (topicsError) {
      return new Response(JSON.stringify({ error: topicsError }), {
        status: 500,
      });
    }

    if (!topics || topics.length === 0) {
      return new Response(JSON.stringify({ error: "No topics generated." }), {
        status: 404,
      });
    }

    const { error: dbError } = await supabase
      .from("trending_topics")
      .insert(topics);

    if (dbError) {
      return new Response(JSON.stringify({ error: dbError }), { status: 500 });
    }

    return new Response(
      JSON.stringify({ message: "Topics generated successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating trending topics:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500,
    });
  }
}
