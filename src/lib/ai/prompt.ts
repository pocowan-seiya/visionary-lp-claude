import { VisionInfo, ProductInfo, BridgeInfo, HeroSectionProps, ProblemSectionProps } from "@/types";
import { lpSectionSchemaString } from "./schema";

/**
 * Generate system prompt for LP generation
 */
export function generateSystemPrompt(): string {
  return `あなたはランディングページ（LP）のコピーライティングとセクション構成の専門家です。

ユーザーから提供される以下の情報をもとに、効果的なLPの全体構成とセクション内容を生成してください：

1. **Vision（ビジョン）**: 実現したい未来の具体的なシーン
2. **Product（商品情報）**: 提供するサービス・商品の詳細
3. **Bridge（ブリッジ）**: ビジョンと商品を結ぶストーリー

# 出力形式

必ず以下のJSON Schemaに従って、LP全体のセクション配列を生成してください：

${lpSectionSchemaString}

# セクションタイプの説明

- **hero**: ファーストビュー。キャッチーな見出しで注目を集める
- **problem**: 課題提示。ターゲットの悩みや痛みを明確化
- **vision**: ビジョン提示。理想の未来を描く
- **lead_message**: リードメッセージ。創業者やリーダーからのメッセージ
- **service**: サービス紹介。提供する価値や機能を説明
- **benefits**: ベネフィット。得られる具体的な成果や変化
- **recommend**: おすすめ対象。どんな人に向いているか
- **flow**: 利用の流れ。ステップバイステップで説明
- **voice**: お客様の声。体験談や評価
- **faq**: よくある質問。疑問や不安を解消
- **cta**: 行動喚起。申し込みや問い合わせへの誘導

# セクション構成のガイドライン

1. **必須セクション**: hero, problem, vision, service, cta は必ず含める
2. **推奨セクション**: benefits, recommend, flow は可能な限り含める
3. **任意セクション**: lead_message, voice, faq は内容に応じて追加
4. **セクション順序**: 一般的な順序は hero → problem → vision → service → benefits → recommend → flow → voice → faq → cta
5. **セクション数**: 合計8〜12セクション程度が適切

# コピーライティングのポイント

- **具体性**: 抽象的な表現ではなく、具体的なイメージが湧く言葉を使う
- **感情訴求**: 理性だけでなく感情にも訴える
- **ベネフィット重視**: 機能ではなく、得られる成果や変化を強調
- **ストーリー性**: ビジョンと商品を自然に結びつける
- **行動喚起**: 明確な次のアクションを示す

# 注意事項

- 画像URL（mainImageUrl, imageUrl, avatarUrl等）は null にしてください
- iconName は null にしてください
- 必須フィールドは必ず含めてください
- 日本語で自然な文章を生成してください
- JSON形式で正しく出力してください`;
}

/**
 * Generate user prompt for LP generation
 */
export function generateUserPrompt(
  vision: VisionInfo,
  product: ProductInfo,
  bridge: BridgeInfo
): string {
  return `以下の情報をもとに、効果的なランディングページのセクション構成を生成してください。

# Vision（ビジョン）

## 具体的なシーン
- **場所**: ${vision.specificScene.place}
- **時間帯**: ${vision.specificScene.timeOfDay}
- **雰囲気**: ${vision.specificScene.atmosphere}
- **物語**: ${vision.specificScene.narrative}

## 実際の現象
- **会話**: ${vision.actualPhenomenon.conversations}
- **行動**: ${vision.actualPhenomenon.actions}
- **目に見える出来事**: ${vision.actualPhenomenon.visibleEvents}

## 世界の状態
- **業界の変化**: ${vision.stateOfWorld.industryShift}
- **社会の変化**: ${vision.stateOfWorld.societyShift}
- **新しい常識**: ${vision.stateOfWorld.newCommonSense}

## 自分の存在
- **役割**: ${vision.myExistence.role}
- **行動**: ${vision.myExistence.actions}
- **内面の状態**: ${vision.myExistence.innerState}

# Product（商品情報）

## サービスアイデンティティ
- **名称**: ${product.serviceIdentity.name}
- **ワンライナー**: ${product.serviceIdentity.oneLiner}
- **カテゴリー**: ${product.serviceIdentity.category}

## 起源ストーリー
${product.originStory}

## ターゲットと痛み
${product.targetAndPain.map((pain, i) => `${i + 1}. ${pain}`).join("\n")}

## 仕組み
${product.mechanism}

## 特徴
${product.features.map((feature, i) => `${i + 1}. ${feature}`).join("\n")}

## ロードマップ
${product.roadmap.map((item, i) => `${i + 1}. ${item}`).join("\n")}

## オファー
${product.offer}

## 価格
${product.price}

## 創業者のスタンス
${product.creatorStance}

# Bridge（ビジョンと商品を結ぶストーリー）

${bridge.bridgeNarrative}

---

上記の情報をもとに、ビジョンと商品を効果的に伝えるLPセクション構成をJSON形式で生成してください。`;
}

/**
 * Generate complete prompt for LP generation
 */
export function generateLPGenerationPrompt(
  vision: VisionInfo,
  product: ProductInfo,
  bridge: BridgeInfo
): { system: string; user: string } {
  return {
    system: generateSystemPrompt(),
    user: generateUserPrompt(vision, product, bridge),
  };
}

/**
 * Generate system prompt for section regeneration
 */
export function generateSectionRegenerationSystemPrompt(
  sectionType: "hero" | "problem"
): string {
  const sectionSchemas = {
    hero: `{
  "type": "hero",
  "props": {
    "eyebrow": "string | null",
    "headline": "string (required)",
    "subheadline": "string | null",
    "calloutText": "string | null",
    "mainImageUrl": "null",
    "alignment": "left" | "center"
  }
}`,
    problem: `{
  "type": "problem",
  "props": {
    "title": "string (required)",
    "description": "string | null",
    "bullets": ["string"] (required, array of strings),
    "note": "string | null"
  }
}`,
  };

  const guidelines = {
    hero: `# Hero セクションのガイドライン

- **headline（見出し）**: 最も重要な要素。ユーザーの注目を一瞬で引く
  - 具体的なベネフィットを含める
  - 短く、インパクトのある表現
  - 15〜30文字程度が理想

- **eyebrow（アイブロー）**: 見出しの上に小さく表示される前置き
  - サービスのカテゴリーや特徴を示す
  - 5〜15文字程度

- **subheadline（サブ見出し）**: 見出しを補足する説明
  - 具体的な価値提案
  - 誰のための、何を解決するサービスか
  - 30〜60文字程度

- **calloutText（強調テキスト）**: 特別なオファーや期限などを強調
  - 緊急性や希少性を訴求
  - 「今なら無料」「限定50名」など

- **alignment**: "center" を推奨（インパクト重視）`,

    problem: `# Problem セクションのガイドライン

- **title（タイトル）**: 課題を端的に表現
  - 「こんなお悩みありませんか？」
  - 「〇〇でこんな課題を抱えていませんか？」
  - ターゲットが共感できる表現

- **description（説明）**: 課題の背景や状況を説明
  - なぜこの課題が重要なのか
  - 放置するとどうなるか
  - 30〜80文字程度

- **bullets（箇条書き）**: 具体的な痛み・悩み
  - 3〜5個が適切
  - 「〜できない」「〜で困っている」形式
  - ターゲットの実際の声を反映
  - 各項目15〜40文字程度

- **note（注記）**: 補足や共感のメッセージ
  - 「これらの課題、よく分かります」
  - 「実は多くの方が同じ悩みを抱えています」`,
  };

  return `あなたはランディングページ（LP）のコピーライティング専門家です。

既存の${sectionType === "hero" ? "Hero" : "Problem"}セクションをより効果的な内容に改善してください。

# 出力形式

以下のJSON形式で1つのセクションを生成してください：

${sectionSchemas[sectionType]}

${guidelines[sectionType]}

# コピーライティングのポイント

- **具体性**: 抽象的な表現ではなく、具体的なイメージが湧く言葉を使う
- **感情訴求**: 理性だけでなく感情にも訴える
- **ターゲット理解**: ペルソナの悩みや願望を深く理解した表現
- **差別化**: 競合との違いを明確に示す
- **行動喚起**: 次のアクションを暗に促す表現

# 注意事項

- mainImageUrl, imageUrl などは null にしてください
- 必須フィールド（required）は必ず含めてください
- 日本語で自然な文章を生成してください
- JSON形式で正しく出力してください
- 既存の内容よりも改善された、より魅力的な内容を生成してください`;
}

/**
 * Generate user prompt for section regeneration
 */
export function generateSectionRegenerationUserPrompt(
  sectionType: "hero" | "problem",
  currentProps: HeroSectionProps | ProblemSectionProps,
  vision: VisionInfo,
  product: ProductInfo,
  bridge: BridgeInfo
): string {
  const currentContent =
    sectionType === "hero"
      ? `## 現在のHeroセクション

- **eyebrow**: ${(currentProps as HeroSectionProps).eyebrow || "（なし）"}
- **headline**: ${(currentProps as HeroSectionProps).headline}
- **subheadline**: ${(currentProps as HeroSectionProps).subheadline || "（なし）"}
- **calloutText**: ${(currentProps as HeroSectionProps).calloutText || "（なし）"}
- **alignment**: ${(currentProps as HeroSectionProps).alignment || "center"}`
      : `## 現在のProblemセクション

- **title**: ${(currentProps as ProblemSectionProps).title}
- **description**: ${(currentProps as ProblemSectionProps).description || "（なし）"}
- **bullets**:
${(currentProps as ProblemSectionProps).bullets.map((b, i) => `  ${i + 1}. ${b}`).join("\n")}
- **note**: ${(currentProps as ProblemSectionProps).note || "（なし）"}`;

  return `以下の情報をもとに、${sectionType === "hero" ? "Hero" : "Problem"}セクションをより効果的な内容に改善してください。

${currentContent}

# Vision（ビジョン）

## 具体的なシーン
- **場所**: ${vision.specificScene.place}
- **時間帯**: ${vision.specificScene.timeOfDay}
- **雰囲気**: ${vision.specificScene.atmosphere}
- **物語**: ${vision.specificScene.narrative}

## 実際の現象
- **会話**: ${vision.actualPhenomenon.conversations}
- **行動**: ${vision.actualPhenomenon.actions}
- **目に見える出来事**: ${vision.actualPhenomenon.visibleEvents}

# Product（商品情報）

## サービスアイデンティティ
- **名称**: ${product.serviceIdentity.name}
- **ワンライナー**: ${product.serviceIdentity.oneLiner}
- **カテゴリー**: ${product.serviceIdentity.category}

## 起源ストーリー
${product.originStory}

## ターゲットと痛み
${product.targetAndPain.map((pain, i) => `${i + 1}. ${pain}`).join("\n")}

## 特徴
${product.features.map((feature, i) => `${i + 1}. ${feature}`).join("\n")}

## オファー
${product.offer}

## 価格
${product.price}

# Bridge（ビジョンと商品を結ぶストーリー）

${bridge.bridgeNarrative}

---

上記の情報と現在の内容を参考に、より魅力的で効果的な${sectionType === "hero" ? "Hero" : "Problem"}セクションをJSON形式で生成してください。
現在の内容を改善し、Vision/Product/Bridgeの情報をより効果的に反映させてください。`;
}

/**
 * Generate complete prompt for section regeneration
 */
export function generateSectionRegenerationPrompt(
  sectionType: "hero" | "problem",
  currentProps: HeroSectionProps | ProblemSectionProps,
  vision: VisionInfo,
  product: ProductInfo,
  bridge: BridgeInfo
): { system: string; user: string } {
  return {
    system: generateSectionRegenerationSystemPrompt(sectionType),
    user: generateSectionRegenerationUserPrompt(
      sectionType,
      currentProps,
      vision,
      product,
      bridge
    ),
  };
}
