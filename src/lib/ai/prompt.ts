import { VisionInfo, ProductInfo, BridgeInfo } from "@/types";
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
