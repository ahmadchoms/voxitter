import { categoriesService } from "@/lib/supabase/categories";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const result = await categoriesService.getCategories();

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
