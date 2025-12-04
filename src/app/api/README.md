# API Documentation

このディレクトリには Colorful LP Builder の REST API エンドポイントが含まれています。

## 認証

すべての API エンドポイント（公開 LP の閲覧を除く）は Supabase Auth による認証が必要です。

リクエストヘッダー:
```
Cookie: sb-[project-ref]-auth-token=...
```

認証は middleware.ts で自動的に処理されます。

## エンドポイント一覧

### LP Projects

#### GET /api/lp
ユーザーの全 LP プロジェクトを取得

**認証**: 必要

**レスポンス**:
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "My LP",
      "slug": "my-lp",
      "status": "draft",
      "theme": {},
      "sections": [],
      "meta": {},
      "created_at": "2024-12-04T00:00:00Z",
      "updated_at": "2024-12-04T00:00:00Z"
    }
  ],
  "count": 1
}
```

#### POST /api/lp
新しい LP プロジェクトを作成

**認証**: 必要

**リクエストボディ**:
```json
{
  "title": "My LP",
  "slug": "my-lp",
  "status": "draft",  // optional: draft | preview | published
  "theme": {},        // optional
  "sections": [],     // optional
  "meta": {}          // optional
}
```

**レスポンス** (201):
```json
{
  "message": "LP project created successfully",
  "data": { /* LP object */ }
}
```

**エラー**:
- 400: タイトルまたはスラッグが不正
- 409: スラッグが既に使用されている
- 401: 未認証

#### GET /api/lp/[lpId]
特定の LP プロジェクトを取得

**認証**: draft/preview の場合は必要、published の場合は不要

**レスポンス**:
```json
{
  "data": { /* LP object */ }
}
```

**エラー**:
- 404: LP が見つからない
- 403: アクセス権限なし

#### PATCH /api/lp/[lpId]
LP プロジェクトを更新

**認証**: 必要（所有者のみ）

**リクエストボディ**:
```json
{
  "title": "Updated Title",        // optional
  "slug": "updated-slug",          // optional
  "status": "published",           // optional
  "theme": { "color": "blue" },    // optional
  "sections": [ /* sections */ ],  // optional
  "meta": {}                       // optional
}
```

**レスポンス**:
```json
{
  "message": "LP project updated successfully",
  "data": { /* updated LP object */ }
}
```

**エラー**:
- 404: LP が見つからない
- 403: アクセス権限なし
- 409: スラッグが既に使用されている

#### DELETE /api/lp/[lpId]
LP プロジェクトを削除

**認証**: 必要（所有者のみ）

**レスポンス**:
```json
{
  "message": "LP project deleted successfully"
}
```

**エラー**:
- 404: LP が見つからない
- 403: アクセス権限なし

### Vision / Product / Bridge

#### GET /api/lp/[lpId]/vision-product
LP の Vision/Product/Bridge データを取得

**認証**: 必要（所有者のみ）

**レスポンス**:
```json
{
  "data": {
    "vision": {
      "specificScene": {
        "place": "...",
        "timeOfDay": "...",
        "atmosphere": "...",
        "narrative": "..."
      },
      "actualPhenomenon": {
        "conversations": "...",
        "actions": "...",
        "visibleEvents": "..."
      },
      "stateOfWorld": {
        "industryShift": "...",
        "societyShift": "...",
        "newCommonSense": "..."
      },
      "myExistence": {
        "role": "...",
        "actions": "...",
        "innerState": "..."
      }
    },
    "product": {
      "serviceIdentity": {
        "name": "...",
        "oneLiner": "...",
        "category": "..."
      },
      "originStory": "...",
      "targetAndPain": ["...", "..."],
      "mechanism": "...",
      "features": ["...", "..."],
      "roadmap": ["...", "..."],
      "offer": "...",
      "price": "...",
      "creatorStance": "..."
    },
    "bridge": {
      "bridgeNarrative": "..."
    },
    "created_at": "2024-12-04T00:00:00Z",
    "updated_at": "2024-12-04T00:00:00Z"
  }
}
```

**エラー**:
- 404: LP または Vision/Product データが見つからない
- 403: アクセス権限なし

#### POST /api/lp/[lpId]/vision-product
Vision/Product/Bridge データを作成または更新

**認証**: 必要（所有者のみ）

**リクエストボディ**:
```json
{
  "vision": { /* VisionInfo */ },
  "product": { /* ProductInfo */ },
  "bridge": { /* BridgeInfo */ }
}
```

**レスポンス**:
```json
{
  "message": "Vision/Product data saved successfully",
  "data": { /* VisionProduct object */ }
}
```

**エラー**:
- 400: バリデーションエラー
- 404: LP が見つからない
- 403: アクセス権限なし

#### DELETE /api/lp/[lpId]/vision-product
Vision/Product/Bridge データを削除

**認証**: 必要（所有者のみ）

**レスポンス**:
```json
{
  "message": "Vision/Product data deleted successfully"
}
```

**エラー**:
- 404: LP が見つからない
- 403: アクセス権限なし

## エラーレスポンス形式

すべてのエラーは以下の形式で返されます:

```json
{
  "error": "Error message"
}
```

バリデーションエラーの場合:
```json
{
  "error": "Validation failed",
  "details": ["Error 1", "Error 2"]
}
```

## ステータスコード

- 200: 成功
- 201: 作成成功
- 400: 不正なリクエスト
- 401: 未認証
- 403: アクセス権限なし
- 404: リソースが見つからない
- 409: コンフリクト（例: スラッグの重複）
- 500: サーバーエラー

## 使用例

### JavaScript/TypeScript での使用

```typescript
// LP 一覧を取得
const response = await fetch('/api/lp', {
  credentials: 'include', // Cookie を含める
});
const { data } = await response.json();

// 新規 LP を作成
const response = await fetch('/api/lp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'My New LP',
    slug: 'my-new-lp',
  }),
  credentials: 'include',
});

// Vision/Product データを保存
const response = await fetch(`/api/lp/${lpId}/vision-product`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    vision: { /* ... */ },
    product: { /* ... */ },
    bridge: { /* ... */ },
  }),
  credentials: 'include',
});
```

### cURL での使用

```bash
# LP 一覧を取得
curl -X GET http://localhost:3000/api/lp \
  -H "Cookie: sb-xxx-auth-token=..."

# 新規 LP を作成
curl -X POST http://localhost:3000/api/lp \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-xxx-auth-token=..." \
  -d '{
    "title": "My New LP",
    "slug": "my-new-lp"
  }'

# Vision/Product データを保存
curl -X POST http://localhost:3000/api/lp/{lpId}/vision-product \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-xxx-auth-token=..." \
  -d @vision-product.json
```

## Row Level Security (RLS)

API は Supabase の RLS ポリシーに従います:

- ユーザーは自分の LP のみ作成・編集・削除可能
- 公開（published）された LP は誰でも閲覧可能
- Vision/Product データは LP の所有者のみアクセス可能

RLS により、データベースレベルでセキュリティが保証されます。
