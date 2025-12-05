import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Colorful LP Builder
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          AI-Driven Landing Page Generator
        </p>
        <div className="bg-card rounded-lg shadow-lg p-8 max-w-2xl mx-auto border">
          <h2 className="text-2xl font-semibold mb-4">ようこそ！ 🎉</h2>
          <p className="text-muted-foreground mb-6">
            Vision、Product、Bridgeを入力するだけで、AIが美しいランディングページを自動生成します。
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth">
              <Button size="lg">
                ログイン / 新規登録
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                ダッシュボード
              </Button>
            </Link>
          </div>
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold mb-3">主な機能</h3>
            <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
              <li>✨ AI による自動LP生成（Claude / GPT-4o / Gemini）</li>
              <li>🎨 ドラッグ&ドロップでセクション編集</li>
              <li>🔄 hero / problem セクションのAI再生成</li>
              <li>🌐 slug ベースの公開URL</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
