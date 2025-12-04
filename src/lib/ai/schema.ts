/**
 * JSON Schema for LP Section Generation
 * Used by AI to generate structured LP sections
 */

export const lpSectionSchema = {
  type: "object",
  properties: {
    sections: {
      type: "array",
      description: "Array of LP sections to be generated",
      items: {
        oneOf: [
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["hero"] },
              props: {
                type: "object",
                properties: {
                  eyebrow: { type: "string", nullable: true },
                  headline: { type: "string" },
                  subheadline: { type: "string", nullable: true },
                  calloutText: { type: "string", nullable: true },
                  mainImageUrl: { type: "string", nullable: true },
                  alignment: { type: "string", enum: ["left", "center"] },
                },
                required: ["headline"],
              },
            },
            required: ["type", "props"],
          },
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["problem"] },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string", nullable: true },
                  bullets: { type: "array", items: { type: "string" } },
                  note: { type: "string", nullable: true },
                },
                required: ["title", "bullets"],
              },
            },
            required: ["type", "props"],
          },
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["vision"] },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string", nullable: true },
                  imageUrl: { type: "string", nullable: true },
                },
                required: ["title"],
              },
            },
            required: ["type", "props"],
          },
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["lead_message"] },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  message: { type: "string" },
                  authorName: { type: "string", nullable: true },
                  authorTitle: { type: "string", nullable: true },
                  authorImageUrl: { type: "string", nullable: true },
                },
                required: ["title", "message"],
              },
            },
            required: ["type", "props"],
          },
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["service"] },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string", nullable: true },
                  features: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        iconName: { type: "string", nullable: true },
                      },
                      required: ["title", "description"],
                    },
                  },
                },
                required: ["title", "features"],
              },
            },
            required: ["type", "props"],
          },
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["benefits"] },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  benefits: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        imageUrl: { type: "string", nullable: true },
                      },
                      required: ["title", "description"],
                    },
                  },
                },
                required: ["title", "benefits"],
              },
            },
            required: ["type", "props"],
          },
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["recommend"] },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string", nullable: true },
                  targetAudience: { type: "array", items: { type: "string" } },
                },
                required: ["title", "targetAudience"],
              },
            },
            required: ["type", "props"],
          },
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["flow"] },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  steps: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        stepNumber: { type: "number" },
                        title: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["stepNumber", "title", "description"],
                    },
                  },
                },
                required: ["title", "steps"],
              },
            },
            required: ["type", "props"],
          },
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["voice"] },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  testimonials: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        role: { type: "string", nullable: true },
                        comment: { type: "string" },
                        avatarUrl: { type: "string", nullable: true },
                        rating: { type: "number", nullable: true },
                      },
                      required: ["name", "comment"],
                    },
                  },
                },
                required: ["title", "testimonials"],
              },
            },
            required: ["type", "props"],
          },
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["faq"] },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  faqs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        answer: { type: "string" },
                      },
                      required: ["question", "answer"],
                    },
                  },
                },
                required: ["title", "faqs"],
              },
            },
            required: ["type", "props"],
          },
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["cta"] },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string", nullable: true },
                  buttonText: { type: "string" },
                  buttonUrl: { type: "string" },
                  secondaryButtonText: { type: "string", nullable: true },
                  secondaryButtonUrl: { type: "string", nullable: true },
                },
                required: ["title", "buttonText", "buttonUrl"],
              },
            },
            required: ["type", "props"],
          },
        ],
      },
    },
  },
  required: ["sections"],
};

/**
 * JSON Schema as string for AI prompt
 */
export const lpSectionSchemaString = JSON.stringify(lpSectionSchema, null, 2);
