import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createLPRepository,
  createVisionProductRepository,
} from "@/lib/repositories";
import { validateVisionProductData } from "@/lib/validations/vision-product";

/**
 * GET /api/lp/[lpId]/vision-product
 * Get Vision/Product/Bridge data for a specific LP
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

    // Get Vision/Product data
    const visionProductRepo = createVisionProductRepository(supabase);
    const data = await visionProductRepo.findByLpId(lpId);

    if (!data) {
      return NextResponse.json(
        { error: "Vision/Product data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        vision: data.vision,
        product: data.product,
        bridge: data.bridge,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/lp/[lpId]/vision-product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lp/[lpId]/vision-product
 * Create or update Vision/Product/Bridge data for a specific LP
 */
export async function POST(
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

    // Parse and validate request body
    const body = await request.json();
    const validation = validateVisionProductData(body);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    // Upsert Vision/Product data
    const visionProductRepo = createVisionProductRepository(supabase);
    const data = await visionProductRepo.upsert({
      lp_id: lpId,
      vision: body.vision,
      product: body.product,
      bridge: body.bridge,
    });

    if (!data) {
      return NextResponse.json(
        { error: "Failed to save Vision/Product data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Vision/Product data saved successfully",
      data: {
        vision: data.vision,
        product: data.product,
        bridge: data.bridge,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/lp/[lpId]/vision-product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lp/[lpId]/vision-product
 * Delete Vision/Product/Bridge data for a specific LP
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

    // Delete Vision/Product data
    const visionProductRepo = createVisionProductRepository(supabase);
    const success = await visionProductRepo.delete(lpId);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete Vision/Product data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Vision/Product data deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/lp/[lpId]/vision-product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
