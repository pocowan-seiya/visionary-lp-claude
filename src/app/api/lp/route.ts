import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createLPRepository } from "@/lib/repositories";

/**
 * GET /api/lp
 * Get all LP projects for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's LP projects
    const lpRepo = createLPRepository(supabase);
    const lps = await lpRepo.findByUserId(user.id);

    return NextResponse.json({
      data: lps,
      count: lps.length,
    });
  } catch (error) {
    console.error("Error in GET /api/lp:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lp
 * Create a new LP project
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!body.slug || typeof body.slug !== "string") {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const lpRepo = createLPRepository(supabase);
    const isAvailable = await lpRepo.isSlugAvailable(body.slug);

    if (!isAvailable) {
      return NextResponse.json(
        { error: "Slug is already in use" },
        { status: 409 }
      );
    }

    // Create LP project
    const lp = await lpRepo.create({
      user_id: user.id,
      title: body.title,
      slug: body.slug,
      status: body.status || "draft",
      theme: body.theme || {},
      sections: body.sections || [],
      meta: body.meta || {},
    });

    if (!lp) {
      return NextResponse.json(
        { error: "Failed to create LP project" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "LP project created successfully",
        data: lp,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/lp:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
