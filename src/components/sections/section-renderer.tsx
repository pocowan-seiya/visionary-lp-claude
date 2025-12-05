import { Section } from "@/types";
import { Star, Check } from "lucide-react";

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
  const { props } = section;

  return (
    <section className="py-16 px-4">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          {props.title}
        </h2>
        {props.imageUrl && (
          <div className="mb-8">
            <img
              src={props.imageUrl}
              alt={props.title}
              className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
            />
          </div>
        )}
        {props.description && (
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
            {props.description}
          </p>
        )}
      </div>
    </section>
  );
}

function LeadMessageSection({ section }: { section: Extract<Section, { type: "lead_message" }> }) {
  const { props } = section;

  return (
    <section className="py-16 px-4 bg-primary/5">
      <div className="container max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          {props.title}
        </h2>
        <div className="bg-background rounded-lg p-8 shadow-sm">
          <p className="text-lg leading-relaxed mb-6 whitespace-pre-wrap">
            {props.message}
          </p>
          {(props.authorName || props.authorTitle) && (
            <div className="flex items-center gap-4 pt-6 border-t">
              {props.authorImageUrl && (
                <img
                  src={props.authorImageUrl}
                  alt={props.authorName || "Author"}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                {props.authorName && (
                  <p className="font-semibold text-lg">{props.authorName}</p>
                )}
                {props.authorTitle && (
                  <p className="text-sm text-muted-foreground">{props.authorTitle}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ServiceSection({ section }: { section: Extract<Section, { type: "service" }> }) {
  const { props } = section;

  return (
    <section className="py-16 px-4">
      <div className="container max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          {props.title}
        </h2>
        {props.description && (
          <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
            {props.description}
          </p>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {props.features.map((feature, index) => (
            <div
              key={index}
              className="bg-muted/30 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection({ section }: { section: Extract<Section, { type: "benefits" }> }) {
  const { props } = section;

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          {props.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {props.benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-background rounded-lg p-8 shadow-sm"
            >
              {benefit.imageUrl && (
                <div className="mb-6">
                  <img
                    src={benefit.imageUrl}
                    alt={benefit.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <h3 className="text-2xl font-semibold mb-4">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecommendSection({ section }: { section: Extract<Section, { type: "recommend" }> }) {
  const { props } = section;

  return (
    <section className="py-16 px-4">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          {props.title}
        </h2>
        {props.description && (
          <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            {props.description}
          </p>
        )}
        <div className="grid gap-4 max-w-2xl mx-auto">
          {props.targetAudience.map((audience, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-muted/30 rounded-lg p-6"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
              <p className="text-base leading-relaxed">{audience}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlowSection({ section }: { section: Extract<Section, { type: "flow" }> }) {
  const { props } = section;

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          {props.title}
        </h2>
        <div className="grid gap-8 md:gap-12">
          {props.steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-lg">
                  {step.stepNumber}
                </div>
                <div className="flex-1 bg-background rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < props.steps.length - 1 && (
                <div className="ml-8 h-8 w-0.5 bg-primary/30 my-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VoiceSection({ section }: { section: Extract<Section, { type: "voice" }> }) {
  const { props } = section;

  return (
    <section className="py-16 px-4">
      <div className="container max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          {props.title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {props.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-muted/30 rounded-lg p-6 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                {testimonial.avatarUrl ? (
                  <img
                    src={testimonial.avatarUrl}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold">{testimonial.name}</p>
                  {testimonial.role && (
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  )}
                </div>
              </div>
              {testimonial.rating && (
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating!
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
              <p className="text-muted-foreground leading-relaxed flex-1">
                {testimonial.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ section }: { section: Extract<Section, { type: "faq" }> }) {
  const { props } = section;

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          {props.title}
        </h2>
        <div className="space-y-6">
          {props.faqs.map((faq, index) => (
            <div key={index} className="bg-background rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-primary">
                Q. {faq.question}
              </h3>
              <p className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-primary/20">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ section }: { section: Extract<Section, { type: "cta" }> }) {
  const { props } = section;

  return (
    <section className="py-20 px-4 bg-primary text-primary-foreground">
      <div className="container max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          {props.title}
        </h2>
        {props.description && (
          <p className="text-lg md:text-xl mb-10 opacity-90">
            {props.description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={props.buttonUrl}
            className="inline-block bg-primary-foreground text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            {props.buttonText}
          </a>
          {props.secondaryButtonText && props.secondaryButtonUrl && (
            <a
              href={props.secondaryButtonUrl}
              className="inline-block border-2 border-primary-foreground text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-foreground/10 transition-colors"
            >
              {props.secondaryButtonText}
            </a>
          )}
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
