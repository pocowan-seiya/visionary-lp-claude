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
 * Generate a unique slug
 */
function generateSlug(): string {
  const uuid = crypto.randomUUID().split('-')[0];
  const timestamp = Date.now().toString(36);
  return `lp-${timestamp}-${uuid}`;
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

    const lpRepo = createLPRepository(supabase);

    // Generate unique slug with retry mechanism
    let slug = body.slug || generateSlug();
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const isAvailable = await lpRepo.isSlugAvailable(slug);

      if (isAvailable) {
        break;
      }

      // Slug taken, generate a new one
      slug = generateSlug();
      attempts++;

      if (attempts >= maxAttempts) {
        return NextResponse.json(
          { error: "Failed to generate unique slug after multiple attempts" },
          { status: 500 }
        );
      }
    }

    // Create LP project
    const lp = await lpRepo.create({
      user_id: user.id,
      title: body.title,
      slug,
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
