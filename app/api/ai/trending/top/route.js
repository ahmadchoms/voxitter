import { supabase } from "@/lib/supabase/client";

export async function GET() {
  try {
    const { data, error } = await supabase.rpc("get_top_trending_topics");

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    const topTopics = data || [];

    return new Response(JSON.stringify(topTopics), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching top trending AI topics:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
