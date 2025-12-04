import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createLPRepository,
  createVisionProductRepository,
} from "@/lib/repositories";
import { generateLPGenerationPrompt } from "@/lib/ai/prompt";
import { generateLPSections, AIProvider } from "@/lib/ai/service";
import { Section } from "@/types";
import { randomUUID } from "crypto";

/**
 * POST /api/lp/[lpId]/generate
 * Generate LP sections using AI based on Vision/Product/Bridge data
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    const visionProductData = await visionProductRepo.findByLpId(lpId);

    if (!visionProductData) {
      return NextResponse.json(
        {
          error:
            "Vision/Product data not found. Please save Vision/Product data first.",
        },
        { status: 404 }
      );
    }

    // Parse request body for optional provider selection
    const body = await request.json().catch(() => ({}));
    const provider = body.provider as AIProvider | undefined;

    // Generate prompts
    const { system, user: userPrompt } = generateLPGenerationPrompt(
      visionProductData.vision,
      visionProductData.product,
      visionProductData.bridge
    );

    console.log(`Generating LP for project ${lpId} with provider: ${provider || "default"}`);

    // Generate sections using AI
    let result;
    try {
      result = await generateLPSections({
        systemPrompt: system,
        userPrompt,
        provider,
      });
    } catch (aiError: any) {
      console.error("AI generation error:", aiError);
      return NextResponse.json(
        {
          error: "Failed to generate LP sections",
          details: aiError.message,
        },
        { status: 500 }
      );
    }

    // Add IDs to generated sections
    const sectionsWithIds: Section[] = result.sections.map((section) => ({
      id: randomUUID(),
      ...section,
    } as Section));

    // Update LP with generated sections
    const updated = await lpRepo.updateSections(lpId, sectionsWithIds);

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to save generated sections" },
        { status: 500 }
      );
    }

    console.log(
      `Successfully generated and saved ${sectionsWithIds.length} sections for LP ${lpId}`
    );

    return NextResponse.json({
      message: "LP sections generated successfully",
      data: {
        sections: sectionsWithIds,
        sectionCount: sectionsWithIds.length,
        provider: result.provider,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/lp/[lpId]/generate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
