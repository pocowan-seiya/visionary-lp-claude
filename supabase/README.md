# Supabase Database Setup

このディレクトリにはSupabaseデータベースのマイグレーションファイルが含まれています。

## セットアップ手順

### 1. Supabaseプロジェクトの作成

1. [Supabase](https://app.supabase.com/)にアクセス
2. 新しいプロジェクトを作成
3. プロジェクトの設定から以下の値を取得：
   - `Project URL`
   - `anon/public` API key

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定：

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. マイグレーションの実行

#### オプション A: Supabase CLI を使用（推奨）

```bash
# Supabase CLI のインストール
npm install -g supabase

# プロジェクトにリンク
supabase link --project-ref your-project-ref

# マイグレーションの実行
supabase db push
```

#### オプション B: Supabase Dashboard を使用

1. Supabase Dashboard の SQL Editor にアクセス
2. `supabase/migrations/20241204000000_create_initial_tables.sql` の内容をコピー
3. SQL Editor に貼り付けて実行

## データベーススキーマ

### テーブル

1. **lp_projects** - LP全体の基本情報とセクション
2. **lp_vision_product** - Vision + Product + Bridge 情報
3. **user_styles** - ユーザーの文章スタイル（任意）

### Row Level Security (RLS)

すべてのテーブルでRLSが有効化されており、以下のポリシーが設定されています：

- ユーザーは自分のデータのみCRUD可能
- 公開（published）ステータスのLPは誰でも閲覧可能

## 型定義の生成

Supabase CLIを使用してTypeScript型定義を生成できます：

```bash
npx supabase gen types typescript --project-id your-project-ref > src/lib/supabase/database.types.ts
```

## トラブルシューティング

### マイグレーションが失敗する場合

1. Supabaseプロジェクトが正しく作成されているか確認
2. 既存のテーブルがある場合は削除してから再実行
3. SQL構文エラーがないか確認

### 認証エラーが発生する場合

1. 環境変数が正しく設定されているか確認
2. APIキーが有効か確認
3. RLSポリシーが正しく設定されているか確認
