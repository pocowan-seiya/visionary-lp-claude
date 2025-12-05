import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createLPRepository } from "@/lib/repositories";

/**
 * GET /api/lp/slug/[slug]
 * Get LP project by slug (public access)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    const lpRepo = createLPRepository(supabase);
    const lp = await lpRepo.findBySlug(slug);

    if (!lp) {
      return NextResponse.json(
        { error: "LP project not found" },
        { status: 404 }
      );
    }

    // Only return published LPs for public access
    if (lp.status !== "published") {
      return NextResponse.json(
        { error: "LP project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: lp });
  } catch (error) {
    console.error("Error in GET /api/lp/slug/[slug]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
