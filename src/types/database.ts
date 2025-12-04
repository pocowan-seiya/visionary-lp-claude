import { Section } from "./sections";
import { VisionInfo, ProductInfo, BridgeInfo } from "./vision-product";

// Database Table Types

export type LPProject = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  status: "draft" | "preview" | "published";
  theme: Record<string, any>;
  sections: Section[];
  meta: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type LPVisionProduct = {
  lp_id: string;
  vision: VisionInfo;
  product: ProductInfo;
  bridge: BridgeInfo;
  created_at: string;
  updated_at: string;
};

export type UserStyle = {
  user_id: string;
  style: {
    tone?: string;
    vocabulary?: string;
    writingStyle?: string;
    preferences?: Record<string, any>;
  };
  created_at: string;
  updated_at: string;
};

// Insert types (without auto-generated fields)
export type LPProjectInsert = Omit<
  LPProject,
  "id" | "created_at" | "updated_at"
> & {
  id?: string;
};

export type LPVisionProductInsert = Omit<
  LPVisionProduct,
  "created_at" | "updated_at"
>;

export type UserStyleInsert = Omit<UserStyle, "created_at" | "updated_at">;

// Update types (all fields optional except id/primary key)
export type LPProjectUpdate = Partial<Omit<LPProject, "id" | "user_id">>;

export type LPVisionProductUpdate = Partial<
  Omit<LPVisionProduct, "lp_id">
>;

export type UserStyleUpdate = Partial<Omit<UserStyle, "user_id">>;
