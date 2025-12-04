"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { VisionInfo } from "@/types";
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

// Zod schema for Vision form validation
const visionFormSchema = z.object({
  specificScene: z.object({
    place: z.string().min(1, "場所を入力してください"),
    timeOfDay: z.string().min(1, "時間帯を入力してください"),
    atmosphere: z.string().min(1, "雰囲気を入力してください"),
    narrative: z.string().min(1, "物語を入力してください"),
  }),
  actualPhenomenon: z.object({
    conversations: z.string().min(1, "会話を入力してください"),
    actions: z.string().min(1, "行動を入力してください"),
    visibleEvents: z.string().min(1, "目に見える出来事を入力してください"),
  }),
  stateOfWorld: z.object({
    industryShift: z.string().min(1, "業界の変化を入力してください"),
    societyShift: z.string().min(1, "社会の変化を入力してください"),
    newCommonSense: z.string().min(1, "新しい常識を入力してください"),
  }),
  myExistence: z.object({
    role: z.string().min(1, "役割を入力してください"),
    actions: z.string().min(1, "行動を入力してください"),
    innerState: z.string().min(1, "内面の状態を入力してください"),
  }),
});

export type VisionFormValues = z.infer<typeof visionFormSchema>;

interface VisionFormProps {
  defaultValues?: Partial<VisionInfo>;
  onSubmit: (values: VisionFormValues) => void;
  isSubmitting?: boolean;
}

export function VisionForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: VisionFormProps) {
  const form = useForm<VisionFormValues>({
    resolver: zodResolver(visionFormSchema),
    defaultValues: defaultValues || {
      specificScene: {
        place: "",
        timeOfDay: "",
        atmosphere: "",
        narrative: "",
      },
      actualPhenomenon: {
        conversations: "",
        actions: "",
        visibleEvents: "",
      },
      stateOfWorld: {
        industryShift: "",
        societyShift: "",
        newCommonSense: "",
      },
      myExistence: {
        role: "",
        actions: "",
        innerState: "",
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Specific Scene Section */}
        <Card>
          <CardHeader>
            <CardTitle>具体的なシーン</CardTitle>
            <CardDescription>
              実現したい未来の具体的なシーンを描いてください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="specificScene.place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>場所</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="例: 東京のカフェ、自宅のリビング"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    そのシーンが展開される場所を具体的に記述してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specificScene.timeOfDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>時間帯</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 朝、昼下がり、夜" {...field} />
                  </FormControl>
                  <FormDescription>
                    いつそのシーンが起きているかを記述してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specificScene.atmosphere"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>雰囲気</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: 静かで落ち着いた雰囲気、活気に満ちた空間"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    その場の空気感、雰囲気を描写してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specificScene.narrative"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>物語</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: 朝のカフェで、人々が自分の時間を楽しんでいる..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    そのシーンで何が起きているかを物語として描いてください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Actual Phenomenon Section */}
        <Card>
          <CardHeader>
            <CardTitle>実際の現象</CardTitle>
            <CardDescription>
              目に見える具体的な出来事や行動を記述してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="actualPhenomenon.conversations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>会話</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: 「このツールのおかげで時間が増えたよ」という声が聞こえる"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    どんな会話が交わされているかを具体的に記述してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actualPhenomenon.actions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>行動</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: 人々がスマホで簡単に操作している、笑顔で作業している"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    人々がどのような行動をとっているかを記述してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actualPhenomenon.visibleEvents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>目に見える出来事</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: 画面に表示される成果、増えていく利用者数"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    具体的に観察できる出来事を記述してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* State of World Section */}
        <Card>
          <CardHeader>
            <CardTitle>世界の状態</CardTitle>
            <CardDescription>
              その未来における業界や社会の変化を描いてください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="stateOfWorld.industryShift"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>業界の変化</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: LP制作の民主化が進み、誰でも簡単に作れるようになった"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    業界全体がどのように変化しているかを記述してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stateOfWorld.societyShift"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>社会の変化</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: 個人が自分のアイデアを簡単に発信できる社会になった"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    社会全体がどう変わっているかを記述してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stateOfWorld.newCommonSense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新しい常識</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: AIアシストは当たり前、デザインスキル不要でも美しいページが作れる"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    新しく生まれた常識や価値観を記述してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* My Existence Section */}
        <Card>
          <CardHeader>
            <CardTitle>自分の存在</CardTitle>
            <CardDescription>
              その未来におけるあなたの役割や状態を描いてください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="myExistence.role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>役割</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: LP制作の民主化を推進するリーダー"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    その未来であなたがどんな役割を担っているかを記述してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="myExistence.actions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>行動</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: 毎日新しいユーザーの成功事例を見て喜んでいる"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    あなたが具体的にどんな行動をとっているかを記述してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="myExistence.innerState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>内面の状態</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: 充実感と達成感に満ちている、使命を果たせている実感がある"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    あなたの心の状態、感情を記述してください
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
