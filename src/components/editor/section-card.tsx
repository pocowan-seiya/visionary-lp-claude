"use client";

import { Section } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Edit, Trash2, RotateCw } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SectionCardProps {
  section: Section;
  onEdit: (section: Section) => void;
  onDelete: (sectionId: string) => void;
  onRegenerate?: (sectionId: string) => void;
}

const SECTION_TYPE_LABELS: Record<string, string> = {
  hero: "ヒーロー",
  problem: "課題提示",
  vision: "ビジョン",
  lead_message: "リードメッセージ",
  service: "サービス紹介",
  benefits: "ベネフィット",
  recommend: "おすすめ対象",
  flow: "利用フロー",
  voice: "お客様の声",
  faq: "よくある質問",
  cta: "CTA（行動喚起）",
};

export function SectionCard({
  section,
  onEdit,
  onDelete,
  onRegenerate,
}: SectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const canRegenerate = section.type === "hero" || section.type === "problem";

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={isDragging ? "shadow-lg" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="cursor-grab active:cursor-grabbing"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </button>
              <div>
                <CardTitle className="text-lg">
                  {SECTION_TYPE_LABELS[section.type] || section.type}
                </CardTitle>
                <CardDescription>ID: {section.id.slice(0, 8)}</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {canRegenerate && onRegenerate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRegenerate(section.id)}
                >
                  <RotateCw className="h-4 w-4 mr-1" />
                  再生成
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(section)}
              >
                <Edit className="h-4 w-4 mr-1" />
                編集
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(section.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                削除
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SectionPreview section={section} />
        </CardContent>
      </Card>
    </div>
  );
}

function SectionPreview({ section }: { section: Section }) {
  switch (section.type) {
    case "hero":
      return (
        <div className="space-y-2 text-sm">
          {section.props.eyebrow && (
            <p className="text-xs text-muted-foreground">
              {section.props.eyebrow}
            </p>
          )}
          <p className="font-semibold text-base">{section.props.headline}</p>
          {section.props.subheadline && (
            <p className="text-muted-foreground">{section.props.subheadline}</p>
          )}
          {section.props.calloutText && (
            <p className="text-sm bg-muted p-2 rounded">
              {section.props.calloutText}
            </p>
          )}
        </div>
      );

    case "problem":
      return (
        <div className="space-y-2 text-sm">
          <p className="font-semibold">{section.props.title}</p>
          {section.props.description && (
            <p className="text-muted-foreground">{section.props.description}</p>
          )}
          <ul className="list-disc list-inside space-y-1">
            {section.props.bullets?.slice(0, 3).map((bullet: string, i: number) => (
              <li key={i} className="text-muted-foreground">
                {bullet}
              </li>
            ))}
          </ul>
          {section.props.bullets?.length > 3 && (
            <p className="text-xs text-muted-foreground">
              ... 他 {section.props.bullets.length - 3} 件
            </p>
          )}
        </div>
      );

    case "vision":
    case "lead_message":
    case "service":
    case "benefits":
    case "recommend":
    case "flow":
    case "voice":
    case "faq":
    case "cta":
      return (
        <div className="text-sm text-muted-foreground">
          <pre className="whitespace-pre-wrap text-xs overflow-hidden max-h-32">
            {JSON.stringify(section.props, null, 2)}
          </pre>
        </div>
      );

    default:
      return (
        <div className="text-sm text-muted-foreground">
          Unknown section type
        </div>
      );
  }
}
