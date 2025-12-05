import { Section } from "@/types";

interface SectionRendererProps {
  section: Section;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  switch (section.type) {
    case "hero":
      return <HeroSection section={section} />;
    case "problem":
      return <ProblemSection section={section} />;
    case "vision":
      return <VisionSection section={section} />;
    case "lead_message":
      return <LeadMessageSection section={section} />;
    case "service":
      return <ServiceSection section={section} />;
    case "benefits":
      return <BenefitsSection section={section} />;
    case "recommend":
      return <RecommendSection section={section} />;
    case "flow":
      return <FlowSection section={section} />;
    case "voice":
      return <VoiceSection section={section} />;
    case "faq":
      return <FAQSection section={section} />;
    case "cta":
      return <CTASection section={section} />;
    default:
      return <GenericSection section={section} />;
  }
}

function HeroSection({ section }: { section: Extract<Section, { type: "hero" }> }) {
  const { props } = section;
  const alignment = props.alignment || "center";

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className={`container max-w-4xl mx-auto ${alignment === "center" ? "text-center" : ""}`}>
        {props.eyebrow && (
          <p className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">
            {props.eyebrow}
          </p>
        )}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {props.headline}
        </h1>
        {props.subheadline && (
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {props.subheadline}
          </p>
        )}
        {props.calloutText && (
          <div className="inline-block bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
            <p className="text-lg font-medium">{props.calloutText}</p>
          </div>
        )}
        {props.mainImageUrl && (
          <div className="mt-8">
            <img
              src={props.mainImageUrl}
              alt="Hero"
              className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function ProblemSection({ section }: { section: Extract<Section, { type: "problem" }> }) {
  const { props } = section;

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          {props.title}
        </h2>
        {props.description && (
          <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            {props.description}
          </p>
        )}
        <div className="grid gap-4 md:gap-6 max-w-2xl mx-auto">
          {props.bullets.map((bullet, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-background rounded-lg p-6 shadow-sm"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold">
                {index + 1}
              </div>
              <p className="text-base leading-relaxed">{bullet}</p>
            </div>
          ))}
        </div>
        {props.note && (
          <p className="text-sm text-muted-foreground mt-8 text-center italic">
            {props.note}
          </p>
        )}
      </div>
    </section>
  );
}

function VisionSection({ section }: { section: Extract<Section, { type: "vision" }> }) {
  return (
    <section className="py-16 px-4">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          ビジョン
        </h2>
        <div className="prose prose-lg max-w-none">
          <pre className="whitespace-pre-wrap bg-muted/30 p-6 rounded-lg">
            {JSON.stringify(section.props, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}

function LeadMessageSection({ section }: { section: Extract<Section, { type: "lead_message" }> }) {
  return (
    <section className="py-16 px-4 bg-primary/5">
      <div className="container max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          リードメッセージ
        </h2>
        <div className="prose prose-lg max-w-none">
          <pre className="whitespace-pre-wrap bg-background p-6 rounded-lg">
            {JSON.stringify(section.props, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}

function ServiceSection({ section }: { section: Extract<Section, { type: "service" }> }) {
  return (
    <section className="py-16 px-4">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          サービス紹介
        </h2>
        <div className="prose prose-lg max-w-none">
          <pre className="whitespace-pre-wrap bg-muted/30 p-6 rounded-lg">
            {JSON.stringify(section.props, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}

function BenefitsSection({ section }: { section: Extract<Section, { type: "benefits" }> }) {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          ベネフィット
        </h2>
        <div className="prose prose-lg max-w-none">
          <pre className="whitespace-pre-wrap bg-background p-6 rounded-lg">
            {JSON.stringify(section.props, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}

function RecommendSection({ section }: { section: Extract<Section, { type: "recommend" }> }) {
  return (
    <section className="py-16 px-4">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          おすすめ対象
        </h2>
        <div className="prose prose-lg max-w-none">
          <pre className="whitespace-pre-wrap bg-muted/30 p-6 rounded-lg">
            {JSON.stringify(section.props, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}

function FlowSection({ section }: { section: Extract<Section, { type: "flow" }> }) {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          利用フロー
        </h2>
        <div className="prose prose-lg max-w-none">
          <pre className="whitespace-pre-wrap bg-background p-6 rounded-lg">
            {JSON.stringify(section.props, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}

function VoiceSection({ section }: { section: Extract<Section, { type: "voice" }> }) {
  return (
    <section className="py-16 px-4">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          お客様の声
        </h2>
        <div className="prose prose-lg max-w-none">
          <pre className="whitespace-pre-wrap bg-muted/30 p-6 rounded-lg">
            {JSON.stringify(section.props, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}

function FAQSection({ section }: { section: Extract<Section, { type: "faq" }> }) {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          よくある質問
        </h2>
        <div className="prose prose-lg max-w-none">
          <pre className="whitespace-pre-wrap bg-background p-6 rounded-lg">
            {JSON.stringify(section.props, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}

function CTASection({ section }: { section: Extract<Section, { type: "cta" }> }) {
  return (
    <section className="py-20 px-4 bg-primary text-primary-foreground">
      <div className="container max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          今すぐ始めよう
        </h2>
        <div className="prose prose-lg max-w-none prose-invert">
          <pre className="whitespace-pre-wrap bg-primary-foreground/10 p-6 rounded-lg">
            {JSON.stringify(section.props, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}

function GenericSection({ section }: { section: Section }) {
  return (
    <section className="py-16 px-4">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          {section.type}
        </h2>
        <div className="prose prose-lg max-w-none">
          <pre className="whitespace-pre-wrap bg-muted/30 p-6 rounded-lg text-sm">
            {JSON.stringify(section.props, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
}
