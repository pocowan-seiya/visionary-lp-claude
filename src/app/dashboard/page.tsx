"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LPProject } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Eye, Trash2, LogOut } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<LPProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    checkUser();
    loadProjects();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth");
      return;
    }

    setUser(user);
  }

  async function loadProjects() {
    try {
      const response = await fetch("/api/lp");
      if (response.ok) {
        const result = await response.json();
        setProjects(result.data || []);
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject() {
    setCreating(true);
    try {
      // Generate unique slug with random suffix
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 7);
      const slug = `lp-${timestamp}-${random}`;

      const response = await fetch("/api/lp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "新しいLP",
          slug,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/lp/${result.data.id}/vision`);
      } else {
        const error = await response.json();
        console.error("Failed to create project:", error);
        alert(`プロジェクトの作成に失敗しました: ${error.error || "不明なエラー"}`);
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("プロジェクトの作成に失敗しました");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm("このLPを削除しますか？")) return;

    try {
      const response = await fetch(`/api/lp/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("削除に失敗しました");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Colorful LP Builder</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">あなたのLP</h2>
            <p className="text-muted-foreground">
              作成したランディングページを管理できます
            </p>
          </div>
          <Button onClick={handleCreateProject} disabled={creating}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {creating ? "作成中..." : "新規作成"}
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-2">
                  まだLPがありません
                </h3>
                <p className="text-muted-foreground mb-6">
                  「新規作成」ボタンから最初のランディングページを作成しましょう
                </p>
                <Button onClick={handleCreateProject} disabled={creating}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  最初のLPを作成
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        project.status === "published"
                          ? "bg-green-500/10 text-green-600"
                          : project.status === "draft"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}>
                        {project.status === "published"
                          ? "公開中"
                          : project.status === "draft"
                          ? "下書き"
                          : "プレビュー"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        /{project.slug}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    {project.sections?.length || 0} セクション
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/lp/${project.id}/vision`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-1" />
                        入力
                      </Button>
                    </Link>
                    <Link href={`/lp/${project.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-1" />
                        編集
                      </Button>
                    </Link>
                    {project.status === "published" && (
                      <Link href={`/p/${project.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
