import { SupabaseClient } from "@supabase/supabase-js";
import {
  LPVisionProduct,
  LPVisionProductInsert,
  LPVisionProductUpdate,
  VisionInfo,
  ProductInfo,
  BridgeInfo,
} from "@/types";
import { Database } from "../supabase/database.types";

export class VisionProductRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Get Vision/Product/Bridge data by LP ID
   */
  async findByLpId(lpId: string): Promise<LPVisionProduct | null> {
    const { data, error } = await this.supabase
      .from("lp_vision_product")
      .select("*")
      .eq("lp_id", lpId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        return null;
      }
      console.error("Error fetching vision/product data:", error);
      return null;
    }

    return this.mapToLPVisionProduct(data);
  }

  /**
   * Create Vision/Product/Bridge data
   */
  async create(data: LPVisionProductInsert): Promise<LPVisionProduct | null> {
    const { data: created, error } = await this.supabase
      .from("lp_vision_product")
      .insert({
        lp_id: data.lp_id,
        vision: data.vision,
        product: data.product,
        bridge: data.bridge,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating vision/product data:", error);
      return null;
    }

    return this.mapToLPVisionProduct(created);
  }

  /**
   * Update Vision/Product/Bridge data
   */
  async update(
    lpId: string,
    data: LPVisionProductUpdate
  ): Promise<LPVisionProduct | null> {
    const updateData: any = {};

    if (data.vision !== undefined) {
      updateData.vision = data.vision;
    }
    if (data.product !== undefined) {
      updateData.product = data.product;
    }
    if (data.bridge !== undefined) {
      updateData.bridge = data.bridge;
    }

    const { data: updated, error } = await this.supabase
      .from("lp_vision_product")
      .update(updateData)
      .eq("lp_id", lpId)
      .select()
      .single();

    if (error) {
      console.error("Error updating vision/product data:", error);
      return null;
    }

    return this.mapToLPVisionProduct(updated);
  }

  /**
   * Upsert Vision/Product/Bridge data (create or update)
   */
  async upsert(data: LPVisionProductInsert): Promise<LPVisionProduct | null> {
    const { data: upserted, error } = await this.supabase
      .from("lp_vision_product")
      .upsert(
        {
          lp_id: data.lp_id,
          vision: data.vision,
          product: data.product,
          bridge: data.bridge,
        },
        {
          onConflict: "lp_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error upserting vision/product data:", error);
      return null;
    }

    return this.mapToLPVisionProduct(upserted);
  }

  /**
   * Delete Vision/Product/Bridge data
   */
  async delete(lpId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("lp_vision_product")
      .delete()
      .eq("lp_id", lpId);

    if (error) {
      console.error("Error deleting vision/product data:", error);
      return false;
    }

    return true;
  }

  /**
   * Update Vision data only
   */
  async updateVision(lpId: string, vision: VisionInfo): Promise<boolean> {
    const { error } = await this.supabase
      .from("lp_vision_product")
      .update({ vision })
      .eq("lp_id", lpId);

    if (error) {
      console.error("Error updating vision data:", error);
      return false;
    }

    return true;
  }

  /**
   * Update Product data only
   */
  async updateProduct(lpId: string, product: ProductInfo): Promise<boolean> {
    const { error } = await this.supabase
      .from("lp_vision_product")
      .update({ product })
      .eq("lp_id", lpId);

    if (error) {
      console.error("Error updating product data:", error);
      return false;
    }

    return true;
  }

  /**
   * Update Bridge data only
   */
  async updateBridge(lpId: string, bridge: BridgeInfo): Promise<boolean> {
    const { error } = await this.supabase
      .from("lp_vision_product")
      .update({ bridge })
      .eq("lp_id", lpId);

    if (error) {
      console.error("Error updating bridge data:", error);
      return false;
    }

    return true;
  }

  /**
   * Check if Vision/Product/Bridge data exists for LP
   */
  async exists(lpId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("lp_vision_product")
      .select("lp_id")
      .eq("lp_id", lpId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking vision/product existence:", error);
      return false;
    }

    return !!data;
  }

  /**
   * Map database row to LPVisionProduct type
   */
  private mapToLPVisionProduct(
    data: Database["public"]["Tables"]["lp_vision_product"]["Row"]
  ): LPVisionProduct {
    return {
      lp_id: data.lp_id,
      vision: data.vision as VisionInfo,
      product: data.product as ProductInfo,
      bridge: data.bridge as BridgeInfo,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }
}

/**
 * Create VisionProduct repository instance with Supabase client
 */
export function createVisionProductRepository(
  supabase: SupabaseClient<Database>
) {
  return new VisionProductRepository(supabase);
}
