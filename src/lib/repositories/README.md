# Repository Functions

このディレクトリにはデータベース操作を抽象化するリポジトリ関数が含まれています。

## 概要

リポジトリパターンを使用することで、以下のメリットがあります：

- データベース操作の一元管理
- 型安全性の向上
- テスト可能なコード
- ビジネスロジックとデータアクセスの分離

## リポジトリ一覧

### 1. LPRepository

LP プロジェクトの CRUD 操作を提供します。

**主な機能:**
- `findById(id)` - ID で LP を検索
- `findBySlug(slug)` - スラッグで LP を検索
- `findByUserId(userId)` - ユーザーの LP 一覧を取得
- `findPublished()` - 公開済み LP 一覧を取得
- `create(data)` - 新規 LP を作成
- `update(id, data)` - LP を更新
- `upsert(data)` - LP を作成または更新
- `delete(id)` - LP を削除
- `updateSections(id, sections)` - セクションのみ更新
- `updateStatus(id, status)` - ステータスのみ更新
- `isSlugAvailable(slug)` - スラッグの重複チェック

### 2. VisionProductRepository

Vision / Product / Bridge データの操作を提供します。

**主な機能:**
- `findByLpId(lpId)` - LP ID で Vision/Product データを取得
- `create(data)` - 新規データを作成
- `update(lpId, data)` - データを更新
- `upsert(data)` - データを作成または更新
- `delete(lpId)` - データを削除
- `updateVision(lpId, vision)` - Vision のみ更新
- `updateProduct(lpId, product)` - Product のみ更新
- `updateBridge(lpId, bridge)` - Bridge のみ更新
- `exists(lpId)` - データの存在確認

### 3. UserStyleRepository

ユーザーの文章スタイル設定を管理します。

**主な機能:**
- `findByUserId(userId)` - ユーザースタイルを取得
- `create(data)` - 新規スタイルを作成
- `update(userId, data)` - スタイルを更新
- `upsert(data)` - スタイルを作成または更新
- `delete(userId)` - スタイルを削除
- `updateStyleProperties(userId, properties)` - 特定プロパティのみ更新
- `exists(userId)` - スタイルの存在確認

## 使用例

### Server Component での使用

```typescript
import { createClient } from "@/lib/supabase/server";
import { createLPRepository } from "@/lib/repositories";

export default async function LPListPage() {
  const supabase = await createClient();
  const lpRepo = createLPRepository(supabase);

  // 現在のユーザーを取得
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>ログインが必要です</div>;
  }

  // ユーザーの LP 一覧を取得
  const lpProjects = await lpRepo.findByUserId(user.id);

  return (
    <div>
      {lpProjects.map((lp) => (
        <div key={lp.id}>
          <h2>{lp.title}</h2>
          <p>Status: {lp.status}</p>
        </div>
      ))}
    </div>
  );
}
```

### API Route での使用

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createVisionProductRepository } from "@/lib/repositories";

export async function GET(
  request: NextRequest,
  { params }: { params: { lpId: string } }
) {
  const supabase = await createClient();
  const visionProductRepo = createVisionProductRepository(supabase);

  // Vision/Product データを取得
  const data = await visionProductRepo.findByLpId(params.lpId);

  if (!data) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { lpId: string } }
) {
  const supabase = await createClient();
  const visionProductRepo = createVisionProductRepository(supabase);

  const body = await request.json();

  // Upsert（存在すれば更新、なければ作成）
  const data = await visionProductRepo.upsert({
    lp_id: params.lpId,
    vision: body.vision,
    product: body.product,
    bridge: body.bridge,
  });

  if (!data) {
    return NextResponse.json(
      { error: "Failed to save data" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
```

### Client Component での使用

```typescript
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createLPRepository } from "@/lib/repositories";
import { LPProject } from "@/types";

export function LPList() {
  const [lps, setLps] = useState<LPProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLPs() {
      const supabase = createClient();
      const lpRepo = createLPRepository(supabase);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const data = await lpRepo.findByUserId(user.id);
      setLps(data);
      setLoading(false);
    }

    fetchLPs();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {lps.map((lp) => (
        <li key={lp.id}>{lp.title}</li>
      ))}
    </ul>
  );
}
```

## エラーハンドリング

各リポジトリメソッドはエラーが発生した場合、コンソールにログを出力し、適切な値を返します：

- 検索系メソッド: `null` または空配列 `[]`
- 作成/更新系メソッド: `null`
- 削除系メソッド: `false`
- 存在確認系メソッド: `false`

実装例：

```typescript
const lpRepo = createLPRepository(supabase);
const lp = await lpRepo.findById(id);

if (!lp) {
  // LP が見つからないか、エラーが発生した
  return { error: "LP not found" };
}

// LP が見つかった
return { data: lp };
```

## Row Level Security (RLS)

すべてのリポジトリ操作は Supabase の RLS ポリシーに従います。適切な認証が必要です。

- ユーザーは自分のデータのみアクセス可能
- 公開された LP は誰でも閲覧可能
- Vision/Product データは LP の所有者のみアクセス可能

## テスト

リポジトリ関数は単体テストが容易です。Supabase クライアントをモックすることで、データベースに接続せずにテストできます。

```typescript
import { createLPRepository } from "@/lib/repositories";

describe("LPRepository", () => {
  it("should find LP by id", async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockLPData,
              error: null,
            }),
          }),
        }),
      }),
    };

    const repo = createLPRepository(mockSupabase as any);
    const lp = await repo.findById("test-id");

    expect(lp).toBeDefined();
  });
});
```
