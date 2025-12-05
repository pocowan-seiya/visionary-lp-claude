"use client";

import { useState, useEffect } from "react";
import { Section, HeroSectionProps, ProblemSectionProps } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";

interface SectionEditDialogProps {
  section: Section | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (section: Section) => void;
}

export function SectionEditDialog({
  section,
  open,
  onOpenChange,
  onSave,
}: SectionEditDialogProps) {
  const [editedSection, setEditedSection] = useState<Section | null>(null);

  useEffect(() => {
    if (section) {
      setEditedSection(JSON.parse(JSON.stringify(section)));
    }
  }, [section]);

  if (!editedSection) return null;

  const handleSave = () => {
    onSave(editedSection);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>セクションを編集</DialogTitle>
          <DialogDescription>
            セクションの内容を編集してください
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {editedSection.type === "hero" && (
            <HeroSectionEditor
              props={editedSection.props}
              onChange={(props) =>
                setEditedSection({ ...editedSection, props })
              }
            />
          )}

          {editedSection.type === "problem" && (
            <ProblemSectionEditor
              props={editedSection.props}
              onChange={(props) =>
                setEditedSection({ ...editedSection, props })
              }
            />
          )}

          {editedSection.type !== "hero" &&
            editedSection.type !== "problem" && (
              <GenericSectionEditor
                props={editedSection.props}
                onChange={(props) =>
                  setEditedSection({ ...editedSection, props })
                }
              />
            )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function HeroSectionEditor({
  props,
  onChange,
}: {
  props: HeroSectionProps;
  onChange: (props: HeroSectionProps) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="eyebrow">アイブロウ（任意）</Label>
        <Input
          id="eyebrow"
          value={props.eyebrow || ""}
          onChange={(e) => onChange({ ...props, eyebrow: e.target.value })}
          placeholder="例: NEW RELEASE"
        />
      </div>

      <div>
        <Label htmlFor="headline">見出し</Label>
        <Textarea
          id="headline"
          value={props.headline}
          onChange={(e) => onChange({ ...props, headline: e.target.value })}
          placeholder="メインの見出し"
          className="min-h-[80px]"
        />
      </div>

      <div>
        <Label htmlFor="subheadline">サブ見出し（任意）</Label>
        <Textarea
          id="subheadline"
          value={props.subheadline || ""}
          onChange={(e) => onChange({ ...props, subheadline: e.target.value })}
          placeholder="サブの見出し"
          className="min-h-[60px]"
        />
      </div>

      <div>
        <Label htmlFor="calloutText">コールアウトテキスト（任意）</Label>
        <Textarea
          id="calloutText"
          value={props.calloutText || ""}
          onChange={(e) => onChange({ ...props, calloutText: e.target.value })}
          placeholder="強調したいメッセージ"
          className="min-h-[60px]"
        />
      </div>

      <div>
        <Label htmlFor="mainImageUrl">メイン画像URL（任意）</Label>
        <Input
          id="mainImageUrl"
          value={props.mainImageUrl || ""}
          onChange={(e) => onChange({ ...props, mainImageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label htmlFor="alignment">配置</Label>
        <select
          id="alignment"
          value={props.alignment || "center"}
          onChange={(e) =>
            onChange({
              ...props,
              alignment: e.target.value as "left" | "center",
            })
          }
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="left">左寄せ</option>
          <option value="center">中央</option>
        </select>
      </div>
    </div>
  );
}

function ProblemSectionEditor({
  props,
  onChange,
}: {
  props: ProblemSectionProps;
  onChange: (props: ProblemSectionProps) => void;
}) {
  const addBullet = () => {
    onChange({
      ...props,
      bullets: [...props.bullets, ""],
    });
  };

  const removeBullet = (index: number) => {
    onChange({
      ...props,
      bullets: props.bullets.filter((_, i) => i !== index),
    });
  };

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...props.bullets];
    newBullets[index] = value;
    onChange({
      ...props,
      bullets: newBullets,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          value={props.title}
          onChange={(e) => onChange({ ...props, title: e.target.value })}
          placeholder="課題セクションのタイトル"
        />
      </div>

      <div>
        <Label htmlFor="description">説明（任意）</Label>
        <Textarea
          id="description"
          value={props.description || ""}
          onChange={(e) => onChange({ ...props, description: e.target.value })}
          placeholder="課題の説明"
          className="min-h-[80px]"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>箇条書き</Label>
          <Button type="button" variant="outline" size="sm" onClick={addBullet}>
            <PlusCircle className="h-4 w-4 mr-1" />
            追加
          </Button>
        </div>
        <div className="space-y-2">
          {props.bullets.map((bullet, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={bullet}
                onChange={(e) => updateBullet(index, e.target.value)}
                placeholder={`箇条書き ${index + 1}`}
                className="min-h-[60px]"
              />
              {props.bullets.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBullet(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="note">注釈（任意）</Label>
        <Textarea
          id="note"
          value={props.note || ""}
          onChange={(e) => onChange({ ...props, note: e.target.value })}
          placeholder="補足情報"
          className="min-h-[60px]"
        />
      </div>
    </div>
  );
}

function GenericSectionEditor({
  props,
  onChange,
}: {
  props: any;
  onChange: (props: any) => void;
}) {
  const [jsonText, setJsonText] = useState(JSON.stringify(props, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setJsonText(value);
    try {
      const parsed = JSON.parse(value);
      onChange(parsed);
      setError(null);
    } catch (e) {
      setError("Invalid JSON");
    }
  };

  return (
    <div className="space-y-2">
      <Label>Props（JSON）</Label>
      <Textarea
        value={jsonText}
        onChange={(e) => handleChange(e.target.value)}
        className="min-h-[300px] font-mono text-sm"
        placeholder="JSON形式でpropsを編集"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        このセクションタイプは汎用エディタで編集してください
      </p>
    </div>
  );
}
