import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createLPRepository,
  createVisionProductRepository,
} from "@/lib/repositories";
import { generateSectionRegenerationPrompt } from "@/lib/ai/prompt";
import { regenerateSection, AIProvider } from "@/lib/ai/service";
import { Section, HeroSectionProps, ProblemSectionProps } from "@/types";

/**
 * POST /api/lp/[lpId]/sections/[sectionId]/regenerate
 * Regenerate a specific section (hero or problem only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lpId: string; sectionId: string }> }
) {
  try {
    const { lpId, sectionId } = await params;
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

    // Find the section to regenerate
    const sectionIndex = lp.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    const section = lp.sections[sectionIndex];

    // Validate section type (only hero and problem can be regenerated)
    if (section.type !== "hero" && section.type !== "problem") {
      return NextResponse.json(
        {
          error: "Only hero and problem sections can be regenerated",
          allowedTypes: ["hero", "problem"],
        },
        { status: 400 }
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

    console.log(
      `Regenerating ${section.type} section ${sectionId} for LP ${lpId}`
    );

    // Generate prompts
    const { system, user: userPrompt } = generateSectionRegenerationPrompt(
      section.type,
      section.props as HeroSectionProps | ProblemSectionProps,
      visionProductData.vision,
      visionProductData.product,
      visionProductData.bridge
    );

    // Regenerate section using AI
    let result;
    try {
      result = await regenerateSection({
        systemPrompt: system,
        userPrompt,
        provider,
      });
    } catch (aiError: any) {
      console.error("AI regeneration error:", aiError);
      return NextResponse.json(
        {
          error: "Failed to regenerate section",
          details: aiError.message,
        },
        { status: 500 }
      );
    }

    // Update the section in the sections array
    const updatedSections: Section[] = [...lp.sections];
    updatedSections[sectionIndex] = {
      id: sectionId,
      type: section.type,
      props: result.section.props,
    } as Section;

    // Save updated sections
    const updated = await lpRepo.updateSections(lpId, updatedSections);

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to save regenerated section" },
        { status: 500 }
      );
    }

    console.log(
      `Successfully regenerated ${section.type} section ${sectionId} for LP ${lpId}`
    );

    return NextResponse.json({
      message: "Section regenerated successfully",
      data: {
        section: updatedSections[sectionIndex],
        provider: result.provider,
      },
    });
  } catch (error) {
    console.error(
      "Error in POST /api/lp/[lpId]/sections/[sectionId]/regenerate:",
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
