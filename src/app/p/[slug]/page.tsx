import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createLPRepository } from "@/lib/repositories";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { LPProject } from "@/types";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getLPBySlug(slug: string): Promise<LPProject | null> {
  const supabase = await createClient();
  const lpRepo = createLPRepository(supabase);
  const lp = await lpRepo.findBySlug(slug);

  // Only return published LPs
  if (!lp || lp.status !== "published") {
    return null;
  }

  return lp;
}

export default async function PublicPreviewPage({ params }: PageProps) {
  const { slug } = await params;
  const lp = await getLPBySlug(slug);

  if (!lp) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">{lp.title}</h1>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {lp.sections && lp.sections.length > 0 ? (
          lp.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))
        ) : (
          <div className="container max-w-4xl mx-auto px-4 py-20 text-center">
            <p className="text-muted-foreground">
              このランディングページにはセクションがありません
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container max-w-6xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Colorful LP Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const lp = await getLPBySlug(slug);

  if (!lp) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: lp.title,
    description: lp.meta?.description || `${lp.title} - Landing Page`,
  };
}
