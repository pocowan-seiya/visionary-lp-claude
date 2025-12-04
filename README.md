# visionary-lp-claude
visionary-lp-claude


# 📘 **Claude Code 専用仕様書（README.md / Project Spec）**

## **Colorful LP Builder — AI-Driven Landing Page Generator**

---

## # 🟦 **1. Overview**

**Colorful LP Builder** は、ユーザーが入力する以下の 3 情報：

* **Vision（ビジョン）**
* **Product（商品情報）**
* **Bridge（ビジョンと商品を結ぶストーリー）**

をもとに、Claude / OpenAI / Gemini のような LLM が
**LP（Landing Page）全文・構成・セクションを自動生成するシステム**です。

生成された LP は、以下のように編集・管理できます：

* セクション単位の編集（props 編集）
* hero / problem セクションの **AI 再生成**
* DnD（ドラッグ＆ドロップ）による並び替え
* プレビュー表示
* システム内での公開（slug ベース）

**Next.js + Supabase** をベースに構築します。

---

# # 🟦 **2. Tech Stack**

| Category    | Technology                                    |
| ----------- | --------------------------------------------- |
| Frontend    | Next.js 14 (App Router), React 18, TypeScript |
| UI          | shadcn/ui, TailwindCSS                        |
| Backend     | Next.js API Routes（Edge or Node）              |
| Auth        | Supabase Auth                                 |
| DB          | Supabase（PostgreSQL + Row Level Security）     |
| AI          | Claude API / OpenAI Responses / Gemini        |
| Interaction | dnd-kit                                       |

---

# # 🟦 **3. Database Schema（Supabase）**

## ### 3.1 `lp_projects`

LP 全体の基本情報 + セクション（JSON）

```sql
create table lp_projects (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id),
  title         text not null,
  slug          text unique not null,
  status        text not null default 'draft', -- draft / preview / published
  theme         jsonb default '{}'::jsonb,
  sections      jsonb default '[]'::jsonb,    -- Section[]
  meta          jsonb default '{}'::jsonb,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
```

---

## ### 3.2 `lp_vision_product`

ユーザーが入力する「Vision + Product + Bridge」

```sql
create table lp_vision_product (
  lp_id      uuid primary key references lp_projects(id) on delete cascade,
  vision     jsonb not null,
  product    jsonb not null,
  bridge     jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## ### 3.3 `user_styles`（任意機能）

ユーザーの文章スタイル情報（将来的な拡張）

```sql
create table user_styles (
  user_id    uuid primary key references auth.users(id),
  style      jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

# # 🟦 **4. TypeScript Types**

Claude Code が利用するための明確な型定義。

---

## ### 4.1 LP Sections

```ts
export type HeroSectionProps = {
  eyebrow?: string | null;
  headline: string;
  subheadline?: string | null;
  calloutText?: string | null;
  mainImageUrl?: string | null;
  alignment?: "left" | "center";
};

export type ProblemSectionProps = {
  title: string;
  description?: string | null;
  bullets: string[];
  note?: string | null;
};

export type Section =
  | { id: string; type: "hero"; props: HeroSectionProps }
  | { id: string; type: "problem"; props: ProblemSectionProps }
  | { id: string; type: "vision"; props: any }
  | { id: string; type: "lead_message"; props: any }
  | { id: string; type: "service"; props: any }
  | { id: string; type: "benefits"; props: any }
  | { id: string; type: "recommend"; props: any }
  | { id: string; type: "flow"; props: any }
  | { id: string; type: "voice"; props: any }
  | { id: string; type: "faq"; props: any }
  | { id: string; type: "cta"; props: any };
```

---

## ### 4.2 Vision / Product / Bridge

```ts
export type VisionSpecificScene = {
  place: string;
  timeOfDay: string;
  atmosphere: string;
  narrative: string;
};

export type VisionActualPhenomenon = {
  conversations: string;
  actions: string;
  visibleEvents: string;
};

export type VisionStateOfWorld = {
  industryShift: string;
  societyShift: string;
  newCommonSense: string;
};

export type VisionMyExistence = {
  role: string;
  actions: string;
  innerState: string;
};

export type VisionInfo = {
  specificScene: VisionSpecificScene;
  actualPhenomenon: VisionActualPhenomenon;
  stateOfWorld: VisionStateOfWorld;
  myExististence: VisionMyExistence;
};

export type ProductInfo = {
  serviceIdentity: {
    name: string;
    oneLiner: string;
    category: string;
  };
  originStory: string;
  targetAndPain: string[];
  mechanism: string;
  features: string[];
  roadmap: string[];
  offer: string;
  price: string;
  creatorStance: string;
};

export type BridgeInfo = {
  bridgeNarrative: string;
};
```

---

# # 🟦 **5. API Specifications（Next.js）**

---

## ### 5.1 Save Vision & Product

`POST /api/lp/[lpId]/vision-product`

```json
{
  "vision": VisionInfo,
  "product": ProductInfo,
  "bridge": BridgeInfo
}
```

---

## ### 5.2 Get Vision & Product

`GET /api/lp/[lpId]/vision-product`

---

## ### 5.3 LP 全体生成

`POST /api/lp/[lpId]/generate`

AIは以下の JSON Schema に従って **Section[]** を返す：

```ts
export type GeneratedSection =
  | { type: "hero"; props: HeroSectionProps }
  | { type: "problem"; props: ProblemSectionProps }
  | { type: "vision"; props: any }
  | ...;
```

サーバー側で `id` を付与し、DB に保存する。

---

## ### 5.4 セクション再生成（hero / problem）

`POST /api/lp/[lpId]/sections/[sectionId]/regenerate`

**Body:**

```json
{
  "type": "hero"
}
```

**Response:**

```json
{
  "section": Section
}
```

---

# # 🟦 **6. Frontend Architecture**

## 6.1 Vision & Product Form（/lp/[id]/vision）

* shadcn/ui の form
* 保存時に `/vision-product` を叩く

## 6.2 LP Section Editor（/lp/[id]/edit）

機能：

* SectionCard のプレビュー
* DnD 並べ替え（dnd-kit）
* hero/problem の「再生成」ボタン
* セクション削除 / 複製（必要なら）

## 6.3 LP Preview（公開ビュー）

URL: `/p/[slug]`

---

# # 🟦 **7. AI Generation Logic**

### ● Input

* VisionInfo
* ProductInfo
* BridgeInfo
* UserStyle（あれば）

### ● Output

* JSON Schema で定義された Section[]

---

# # 🟦 **8. Implementation Tasks（Claude Code 向け）**

Claude Code は **1 回につき 1〜2 個のタスク**を実行するのが最も安定します。

以下のタスクに沿って順番に依頼してください。

---

### **TASK 1 — Project Initialization**

* Next.js + TypeScript セットアップ
* TailwindCSS セットアップ
* shadcn/ui セットアップ
* 開発サーバーが起動する状態に

---

### **TASK 2 — Supabase DB Migration**

* `lp_projects` 作成
* `lp_vision_product` 作成
* `user_styles` 作成（任意）

---

### **TASK 3 — Repository Functions**

* lpRepository（CRUD + upsert）
* visionProductRepository
* userStyleRepository

---

### **TASK 4 — Vision Product API**

* `GET /vision-product`
* `POST /vision-product`

---

### **TASK 5 — LP 全体生成 API**

* JSON Schema 対応
* Section[] 生成
* id 付与・保存まで

---

### **TASK 6 — Section 再生成 API**

* `POST /sections/[sectionId]/regenerate`
* hero / problem の再生成

---

### **TASK 7 — Vision Form UI**

* 各フォーム（specificScene, actualPhenomenon など）
* 保存ボタン実装

---

### **TASK 8 — Section Editor（DnD 操作）**

---

### **TASK 9 — Public Preview Page**

* `/p/[slug]`
* SSR でセクションを描画

---

# # 🟦 **9. Claude Code に渡すときの推奨メッセージ（テンプレ）**

以下をそのまま Claude Code に送れば、迷わず動けます👇

---

### **💬 Claude Code 用指示テンプレ**

```
このリポジトリの README（プロジェクト仕様書）を読み込んでください。

まずは Task 1（Project Initialization）を実行してください。
Next.js + TypeScript + TailwindCSS + shadcn/ui の初期セットアップを行い、
`npm run dev` で開発サーバーが起動する状態にしてください。

完了したら：
- 作成/変更したファイル一覧
- 実行したコマンド
- 次に取り組むべきタスク候補

をまとめて提示してください。
```

---
