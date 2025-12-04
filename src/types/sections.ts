// LP Section Types

export type HeroSectionProps = {
  eyebrow?: string | null;
  headline: string;
  subheadline?: string | null;
  calloutText?: string | null;
  mainImageUrl?: string | null;
  alignment?: "left" | "center";
};

export type ProblemSectionProps = {
  title: string;
  description?: string | null;
  bullets: string[];
  note?: string | null;
};

export type VisionSectionProps = {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
};

export type LeadMessageSectionProps = {
  title: string;
  message: string;
  authorName?: string | null;
  authorTitle?: string | null;
  authorImageUrl?: string | null;
};

export type ServiceSectionProps = {
  title: string;
  description?: string | null;
  features: {
    title: string;
    description: string;
    iconName?: string | null;
  }[];
};

export type BenefitsSectionProps = {
  title: string;
  benefits: {
    title: string;
    description: string;
    imageUrl?: string | null;
  }[];
};

export type RecommendSectionProps = {
  title: string;
  description?: string | null;
  targetAudience: string[];
};

export type FlowSectionProps = {
  title: string;
  steps: {
    stepNumber: number;
    title: string;
    description: string;
  }[];
};

export type VoiceSectionProps = {
  title: string;
  testimonials: {
    name: string;
    role?: string | null;
    comment: string;
    avatarUrl?: string | null;
    rating?: number | null;
  }[];
};

export type FAQSectionProps = {
  title: string;
  faqs: {
    question: string;
    answer: string;
  }[];
};

export type CTASectionProps = {
  title: string;
  description?: string | null;
  buttonText: string;
  buttonUrl: string;
  secondaryButtonText?: string | null;
  secondaryButtonUrl?: string | null;
};

export type Section =
  | { id: string; type: "hero"; props: HeroSectionProps }
  | { id: string; type: "problem"; props: ProblemSectionProps }
  | { id: string; type: "vision"; props: VisionSectionProps }
  | { id: string; type: "lead_message"; props: LeadMessageSectionProps }
  | { id: string; type: "service"; props: ServiceSectionProps }
  | { id: string; type: "benefits"; props: BenefitsSectionProps }
  | { id: string; type: "recommend"; props: RecommendSectionProps }
  | { id: string; type: "flow"; props: FlowSectionProps }
  | { id: string; type: "voice"; props: VoiceSectionProps }
  | { id: string; type: "faq"; props: FAQSectionProps }
  | { id: string; type: "cta"; props: CTASectionProps };

// Generated Section Types (used in AI generation API responses)
export type GeneratedSection = Omit<Section, "id">;
