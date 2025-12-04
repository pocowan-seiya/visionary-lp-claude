import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createLPRepository } from "@/lib/repositories";

/**
 * GET /api/lp/[lpId]
 * Get LP project details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lpId: string }> }
) {
  try {
    const { lpId } = await params;
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const lpRepo = createLPRepository(supabase);
    const lp = await lpRepo.findById(lpId);

    if (!lp) {
      return NextResponse.json(
        { error: "LP project not found" },
        { status: 404 }
      );
    }

    // Check access permissions
    // Allow public access for published LPs, otherwise require ownership
    if (lp.status !== "published") {
      if (authError || !user) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      if (lp.user_id !== user.id) {
        return NextResponse.json(
          { error: "Forbidden: You don't have access to this LP" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ data: lp });
  } catch (error) {
    console.error("Error in GET /api/lp/[lpId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/lp/[lpId]
 * Update LP project
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ lpId: string }> }
) {
  try {
    const { lpId } = await params;
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

    // Verify LP ownership
    const lpRepo = createLPRepository(supabase);
    const lp = await lpRepo.findById(lpId);

    if (!lp) {
      return NextResponse.json(
        { error: "LP project not found" },
        { status: 404 }
      );
    }

    if (lp.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You don't have access to this LP" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate slug uniqueness if slug is being updated
    if (body.slug && body.slug !== lp.slug) {
      const isAvailable = await lpRepo.isSlugAvailable(body.slug, lpId);
      if (!isAvailable) {
        return NextResponse.json(
          { error: "Slug is already in use" },
          { status: 409 }
        );
      }
    }

    // Update LP
    const updated = await lpRepo.update(lpId, body);

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update LP project" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "LP project updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error in PATCH /api/lp/[lpId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lp/[lpId]
 * Delete LP project
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ lpId: string }> }
) {
  try {
    const { lpId } = await params;
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

    // Verify LP ownership
    const lpRepo = createLPRepository(supabase);
    const lp = await lpRepo.findById(lpId);

    if (!lp) {
      return NextResponse.json(
        { error: "LP project not found" },
        { status: 404 }
      );
    }

    if (lp.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You don't have access to this LP" },
        { status: 403 }
      );
    }

    // Delete LP (cascade will delete vision_product data)
    const success = await lpRepo.delete(lpId);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete LP project" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "LP project deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/lp/[lpId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
