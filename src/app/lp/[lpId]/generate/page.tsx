"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function GeneratePage() {
  const params = useParams();
  const router = useRouter();
  const lpId = params.lpId as string;

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<"claude" | "openai" | "gemini">("openai");

  async function handleGenerate() {
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch(`/api/lp/${lpId}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ provider }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate LP");
      }

      const result = await response.json();

      // 生成成功 - エディタページへ
      router.push(`/lp/${lpId}/edit`);
    } catch (err) {
      console.error("Error generating LP:", err);
      setError(err instanceof Error ? err.message : "Failed to generate LP");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <Link href={`/lp/${lpId}/vision`}>
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">LPを生成</CardTitle>
          <CardDescription>
            AIがあなたのVision、Product、Bridgeから最適なランディングページを生成します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Provider Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              AIプロバイダーを選択
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setProvider("claude")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  provider === "claude"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-semibold">Claude</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Anthropic
                </div>
              </button>

              <button
                onClick={() => setProvider("openai")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  provider === "openai"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-semibold">GPT-4o</div>
                <div className="text-xs text-muted-foreground mt-1">
                  OpenAI
                </div>
              </button>

              <button
                onClick={() => setProvider("gemini")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  provider === "gemini"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-semibold">Gemini</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Google
                </div>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">生成される内容</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Hero セクション（メインビジュアル）</li>
              <li>• Problem セクション（課題提示）</li>
              <li>• Vision セクション（ビジョン）</li>
              <li>• その他の最適なセクション構成</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">エラー</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive">{error}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  .env.local に {provider.toUpperCase()} の APIキーが設定されているか確認してください。
                </p>
              </CardContent>
            </Card>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={generating}
            size="lg"
            className="w-full"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {generating ? "生成中... (30秒〜1分かかります)" : "LPを生成する"}
          </Button>

          {/* Progress Info */}
          {generating && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-sm text-muted-foreground">
                AIがランディングページを生成しています...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
