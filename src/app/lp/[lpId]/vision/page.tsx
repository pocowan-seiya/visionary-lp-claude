"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { VisionForm, VisionFormValues } from "@/components/forms/vision-form";
import { ProductForm, ProductFormValues } from "@/components/forms/product-form";
import { BridgeForm, BridgeFormValues } from "@/components/forms/bridge-form";
import { VisionInfo, ProductInfo, BridgeInfo } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

type Step = "vision" | "product" | "bridge";

export default function VisionProductPage() {
  const params = useParams();
  const router = useRouter();
  const lpId = params.lpId as string;

  const [currentStep, setCurrentStep] = useState<Step>("vision");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form data state
  const [visionData, setVisionData] = useState<Partial<VisionInfo> | undefined>();
  const [productData, setProductData] = useState<Partial<ProductInfo> | undefined>();
  const [bridgeData, setBridgeData] = useState<Partial<BridgeInfo> | undefined>();

  // Load existing data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/lp/${lpId}/vision-product`, {
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          setVisionData(result.data.vision);
          setProductData(result.data.product);
          setBridgeData(result.data.bridge);
        } else if (response.status === 404) {
          // No data yet, that's okay
          console.log("No Vision/Product data found, starting fresh");
        } else {
          throw new Error("Failed to load Vision/Product data");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [lpId]);

  // Save data to API
  async function saveData(
    vision?: VisionFormValues,
    product?: ProductFormValues,
    bridge?: BridgeFormValues
  ) {
    const payload = {
      vision: vision || visionData,
      product: product || productData,
      bridge: bridge || bridgeData,
    };

    const response = await fetch(`/api/lp/${lpId}/vision-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save data");
    }

    return response.json();
  }

  // Handle Vision form submission
  async function handleVisionSubmit(values: VisionFormValues) {
    try {
      setIsSubmitting(true);
      setError(null);
      await saveData(values);
      setVisionData(values);
      setCurrentStep("product");
    } catch (err) {
      console.error("Error saving Vision data:", err);
      setError(err instanceof Error ? err.message : "Failed to save Vision data");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle Product form submission
  async function handleProductSubmit(values: ProductFormValues) {
    try {
      setIsSubmitting(true);
      setError(null);
      await saveData(undefined, values);
      setProductData(values);
      setCurrentStep("bridge");
    } catch (err) {
      console.error("Error saving Product data:", err);
      setError(err instanceof Error ? err.message : "Failed to save Product data");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle Bridge form submission
  async function handleBridgeSubmit(values: BridgeFormValues) {
    try {
      setIsSubmitting(true);
      setError(null);
      await saveData(undefined, undefined, values);
      setBridgeData(values);

      // Navigate to generate page or LP editor
      router.push(`/lp/${lpId}/generate`);
    } catch (err) {
      console.error("Error saving Bridge data:", err);
      setError(err instanceof Error ? err.message : "Failed to save Bridge data");
    } finally {
      setIsSubmitting(false);
    }
  }

  const steps = [
    { id: "vision" as Step, label: "Vision", completed: !!visionData },
    { id: "product" as Step, label: "Product", completed: !!productData },
    { id: "bridge" as Step, label: "Bridge", completed: !!bridgeData },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vision / Product / Bridge</h1>
        <p className="text-muted-foreground">
          LP生成に必要な情報を入力してください
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => setCurrentStep(step.id)}
                className="flex items-center"
                disabled={isSubmitting}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep === step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : step.completed
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {step.completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`ml-3 text-sm font-medium ${
                    currentStep === step.id
                      ? "text-primary"
                      : step.completed
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    step.completed ? "bg-green-500" : "bg-muted-foreground/30"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="mb-6 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">エラー</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => {
            const prevIndex = currentStepIndex - 1;
            if (prevIndex >= 0) {
              setCurrentStep(steps[prevIndex].id);
            }
          }}
          disabled={currentStepIndex === 0 || isSubmitting}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          前へ
        </Button>

        {currentStepIndex < steps.length - 1 && (
          <Button
            variant="outline"
            onClick={() => {
              const nextIndex = currentStepIndex + 1;
              if (nextIndex < steps.length) {
                setCurrentStep(steps[nextIndex].id);
              }
            }}
            disabled={isSubmitting}
          >
            次へ
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Form Content */}
      <div className="mt-8">
        {currentStep === "vision" && (
          <VisionForm
            defaultValues={visionData}
            onSubmit={handleVisionSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === "product" && (
          <ProductForm
            defaultValues={productData}
            onSubmit={handleProductSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === "bridge" && (
          <BridgeForm
            defaultValues={bridgeData}
            onSubmit={handleBridgeSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
