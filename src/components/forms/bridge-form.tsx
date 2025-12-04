"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BridgeInfo } from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Zod schema for Bridge form validation
const bridgeFormSchema = z.object({
  bridgeNarrative: z.string().min(1, "ブリッジストーリーを入力してください"),
});

export type BridgeFormValues = z.infer<typeof bridgeFormSchema>;

interface BridgeFormProps {
  defaultValues?: Partial<BridgeInfo>;
  onSubmit: (values: BridgeFormValues) => void;
  isSubmitting?: boolean;
}

export function BridgeForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: BridgeFormProps) {
  const form = useForm<BridgeFormValues>({
    resolver: zodResolver(bridgeFormSchema),
    defaultValues: defaultValues || {
      bridgeNarrative: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>ブリッジストーリー</CardTitle>
            <CardDescription>
              Vision（実現したい未来）と Product（あなたの商品）を結ぶストーリーを描いてください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="bridgeNarrative"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ストーリー</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例:
多くの起業家がビジョンを持っていながら、LP制作という技術的な壁に阻まれています。

Colorful LP Builderは、このギャップを埋めるために生まれました。あなたが描くビジョンと商品の魅力を入力するだけで、AIが最適なLPを自動生成します。

これにより、デザインスキルやコーディング知識がなくても、あなたのビジョンを形にし、世界に届けることができます。

技術的な制約から解放され、本質的な価値創造に集中できる未来。それが私たちの目指す世界です。"
                      className="min-h-[300px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    あなたのビジョンと商品がどのようにつながっているか、その商品を通じてどのようにビジョンが実現されるかを物語として描いてください。具体的な例や体験を交えながら、読み手の心に響くストーリーを作りましょう。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存して完了"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
