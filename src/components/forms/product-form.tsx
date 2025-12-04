"use client";

import { useForm, useFieldArray, Control, FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProductInfo } from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";

// Zod schema for Product form validation
const productFormSchema = z.object({
  serviceIdentity: z.object({
    name: z.string().min(1, "サービス名を入力してください"),
    oneLiner: z.string().min(1, "ワンライナーを入力してください"),
    category: z.string().min(1, "カテゴリーを入力してください"),
  }),
  originStory: z.string().min(1, "起源ストーリーを入力してください"),
  targetAndPain: z
    .array(z.string().min(1, "ターゲットの痛みを入力してください"))
    .min(1, "最低1つのターゲットの痛みを入力してください"),
  mechanism: z.string().min(1, "仕組みを入力してください"),
  features: z
    .array(z.string().min(1, "特徴を入力してください"))
    .min(1, "最低1つの特徴を入力してください"),
  roadmap: z
    .array(z.string().min(1, "ロードマップ項目を入力してください"))
    .min(1, "最低1つのロードマップ項目を入力してください"),
  offer: z.string().min(1, "オファーを入力してください"),
  price: z.string().min(1, "価格を入力してください"),
  creatorStance: z.string().min(1, "創業者のスタンスを入力してください"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductInfo>;
  onSubmit: (values: ProductFormValues) => void;
  isSubmitting?: boolean;
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      serviceIdentity: {
        name: defaultValues?.serviceIdentity?.name || "",
        oneLiner: defaultValues?.serviceIdentity?.oneLiner || "",
        category: defaultValues?.serviceIdentity?.category || "",
      },
      originStory: defaultValues?.originStory || "",
      targetAndPain: defaultValues?.targetAndPain || [""],
      mechanism: defaultValues?.mechanism || "",
      features: defaultValues?.features || [""],
      roadmap: defaultValues?.roadmap || [""],
      offer: defaultValues?.offer || "",
      price: defaultValues?.price || "",
      creatorStance: defaultValues?.creatorStance || "",
    },
  });

  const {
    fields: targetAndPainFields,
    append: appendTargetAndPain,
    remove: removeTargetAndPain,
  } = useFieldArray({
    control: form.control as any,
    name: "targetAndPain",
  });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control: form.control as any,
    name: "features",
  });

  const {
    fields: roadmapFields,
    append: appendRoadmap,
    remove: removeRoadmap,
  } = useFieldArray({
    control: form.control as any,
    name: "roadmap",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Service Identity Section */}
        <Card>
          <CardHeader>
            <CardTitle>サービスアイデンティティ</CardTitle>
            <CardDescription>
              あなたのサービス・商品の基本情報を記入してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="serviceIdentity.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>サービス名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="例: Colorful LP Builder"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    あなたのサービス・商品の名称
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceIdentity.oneLiner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ワンライナー</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="例: AIが自動生成する、誰でも簡単に美しいLPを作れるツール"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    一言でサービスを表現してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceIdentity.category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>カテゴリー</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="例: LP制作ツール、Webデザインサービス"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    サービスのカテゴリーや業種
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Origin Story Section */}
        <Card>
          <CardHeader>
            <CardTitle>起源ストーリー</CardTitle>
            <CardDescription>
              なぜこのサービスを作ったのか、その背景を教えてください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="originStory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>起源ストーリー</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: LP制作に時間がかかりすぎる問題を自分自身が経験し、もっと簡単に作れるツールが必要だと感じた..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    サービス誕生の背景や、創業の想い
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Target and Pain Section */}
        <Card>
          <CardHeader>
            <CardTitle>ターゲットと痛み</CardTitle>
            <CardDescription>
              ターゲットユーザーが抱える具体的な痛み・課題
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {targetAndPainFields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`targetAndPain.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>痛み {index + 1}</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Textarea
                          placeholder="例: LP制作に何週間もかかってしまう"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      {targetAndPainFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTargetAndPain(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendTargetAndPain("")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              痛みを追加
            </Button>
          </CardContent>
        </Card>

        {/* Mechanism Section */}
        <Card>
          <CardHeader>
            <CardTitle>仕組み</CardTitle>
            <CardDescription>
              サービスがどのように機能するかを説明してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="mechanism"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>仕組み</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: Vision/Product/Bridgeを入力すると、AIが最適なLP構成を自動生成します..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    どのような仕組みで問題を解決するか
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle>特徴</CardTitle>
            <CardDescription>
              サービスの主な特徴や強みを列挙してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {featureFields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`features.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>特徴 {index + 1}</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="例: AI自動生成で時間を90%削減"
                          {...field}
                        />
                      </FormControl>
                      {featureFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFeature(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendFeature("")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              特徴を追加
            </Button>
          </CardContent>
        </Card>

        {/* Roadmap Section */}
        <Card>
          <CardHeader>
            <CardTitle>ロードマップ</CardTitle>
            <CardDescription>
              今後の開発予定や将来のビジョン
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {roadmapFields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`roadmap.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ロードマップ {index + 1}</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="例: Q1: セクション追加機能を実装"
                          {...field}
                        />
                      </FormControl>
                      {roadmapFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRoadmap(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendRoadmap("")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              ロードマップを追加
            </Button>
          </CardContent>
        </Card>

        {/* Offer Section */}
        <Card>
          <CardHeader>
            <CardTitle>オファー</CardTitle>
            <CardDescription>
              ユーザーに提供する具体的な価値やサービス内容
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="offer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>オファー</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: 月額制で無制限にLPを作成できる、初月無料トライアル付き"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    何を、どのような形で提供するか
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Price Section */}
        <Card>
          <CardHeader>
            <CardTitle>価格</CardTitle>
            <CardDescription>
              料金プランや価格設定を記入してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>価格</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: 月額9,800円（税込）、年間プランは20%オフ"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    具体的な料金体系
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Creator Stance Section */}
        <Card>
          <CardHeader>
            <CardTitle>創業者のスタンス</CardTitle>
            <CardDescription>
              あなたのサービスに対する想いや哲学を表現してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="creatorStance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>創業者のスタンス</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: 誰もが自分のビジョンを形にできる世界を作りたい。デザインやコーディングの壁を取り除き、アイデアさえあれば誰でも..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    あなたの信念や、サービスに込めた想い
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存して次へ"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
