"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Section } from "@/types";
import { SectionCard } from "@/components/editor/section-card";
import { SectionEditDialog } from "@/components/editor/section-edit-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";

export default function SectionEditorPage() {
  const params = useParams();
  const router = useRouter();
  const lpId = params.lpId as string;

  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lpTitle, setLpTitle] = useState<string>("");

  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load LP and sections
  useEffect(() => {
    async function loadLP() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/lp/${lpId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to load LP");
        }

        const result = await response.json();
        setSections(result.data.sections || []);
        setLpTitle(result.data.title || "");
      } catch (err) {
        console.error("Error loading LP:", err);
        setError(err instanceof Error ? err.message : "Failed to load LP");
      } finally {
        setIsLoading(false);
      }
    }

    loadLP();
  }, [lpId]);

  // Handle drag end
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // Save sections
  async function handleSave() {
    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(`/api/lp/${lpId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sections,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save sections");
      }

      alert("保存しました！");
    } catch (err) {
      console.error("Error saving sections:", err);
      setError(err instanceof Error ? err.message : "Failed to save sections");
    } finally {
      setIsSaving(false);
    }
  }

  // Edit section
  function handleEdit(section: Section) {
    setEditingSection(section);
    setEditDialogOpen(true);
  }

  // Save edited section
  function handleSaveEdit(updatedSection: Section) {
    setSections((prev) =>
      prev.map((s) => (s.id === updatedSection.id ? updatedSection : s))
    );
  }

  // Delete section
  function handleDelete(sectionId: string) {
    if (confirm("このセクションを削除しますか？")) {
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
    }
  }

  // Regenerate section
  async function handleRegenerate(sectionId: string) {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    if (section.type !== "hero" && section.type !== "problem") {
      alert("再生成はheroとproblemセクションのみ対応しています");
      return;
    }

    if (!confirm("このセクションを再生成しますか？")) {
      return;
    }

    try {
      setIsRegenerating(sectionId);
      setError(null);

      const response = await fetch(
        `/api/lp/${lpId}/sections/${sectionId}/regenerate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: section.type,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to regenerate section");
      }

      const result = await response.json();
      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? result.data.section : s))
      );
    } catch (err) {
      console.error("Error regenerating section:", err);
      setError(
        err instanceof Error ? err.message : "Failed to regenerate section"
      );
    } finally {
      setIsRegenerating(null);
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link href={`/lp/${lpId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                戻る
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mt-2">セクション編集</h1>
            <p className="text-muted-foreground mt-1">{lpTitle}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/p/${lpId}`} target="_blank">
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                プレビュー
              </Button>
            </Link>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-destructive mb-4">
            <CardHeader>
              <CardTitle className="text-destructive">エラー</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Instructions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>使い方</CardTitle>
          <CardDescription>
            セクションをドラッグ&ドロップで並び替えできます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>セクションを上下にドラッグして並び替え</li>
            <li>編集ボタンでセクションの内容を変更</li>
            <li>hero/problemセクションは再生成ボタンでAI再生成可能</li>
            <li>変更後は必ず「保存」ボタンをクリック</li>
          </ul>
        </CardContent>
      </Card>

      {/* Sections List */}
      {sections.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              セクションがありません。Vision/Productフォームを入力してLPを生成してください。
            </p>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {sections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onRegenerate={
                    isRegenerating === section.id
                      ? undefined
                      : handleRegenerate
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Edit Dialog */}
      <SectionEditDialog
        section={editingSection}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
