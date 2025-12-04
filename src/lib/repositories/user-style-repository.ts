import { SupabaseClient } from "@supabase/supabase-js";
import { UserStyle, UserStyleInsert, UserStyleUpdate } from "@/types";
import { Database } from "../supabase/database.types";

export class UserStyleRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Get user style by user ID
   */
  async findByUserId(userId: string): Promise<UserStyle | null> {
    const { data, error } = await this.supabase
      .from("user_styles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        return null;
      }
      console.error("Error fetching user style:", error);
      return null;
    }

    return this.mapToUserStyle(data);
  }

  /**
   * Create user style
   */
  async create(data: UserStyleInsert): Promise<UserStyle | null> {
    const { data: created, error } = await this.supabase
      .from("user_styles")
      .insert({
        user_id: data.user_id,
        style: data.style,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user style:", error);
      return null;
    }

    return this.mapToUserStyle(created);
  }

  /**
   * Update user style
   */
  async update(
    userId: string,
    data: UserStyleUpdate
  ): Promise<UserStyle | null> {
    const { data: updated, error } = await this.supabase
      .from("user_styles")
      .update({
        ...(data.style !== undefined && { style: data.style }),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user style:", error);
      return null;
    }

    return this.mapToUserStyle(updated);
  }

  /**
   * Upsert user style (create or update)
   */
  async upsert(data: UserStyleInsert): Promise<UserStyle | null> {
    const { data: upserted, error } = await this.supabase
      .from("user_styles")
      .upsert(
        {
          user_id: data.user_id,
          style: data.style,
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error upserting user style:", error);
      return null;
    }

    return this.mapToUserStyle(upserted);
  }

  /**
   * Delete user style
   */
  async delete(userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("user_styles")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting user style:", error);
      return false;
    }

    return true;
  }

  /**
   * Check if user style exists
   */
  async exists(userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("user_styles")
      .select("user_id")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking user style existence:", error);
      return false;
    }

    return !!data;
  }

  /**
   * Update specific style properties
   */
  async updateStyleProperties(
    userId: string,
    properties: Partial<UserStyle["style"]>
  ): Promise<boolean> {
    // First get the current style
    const current = await this.findByUserId(userId);
    if (!current) {
      return false;
    }

    // Merge with new properties
    const updatedStyle = {
      ...current.style,
      ...properties,
    };

    const { error } = await this.supabase
      .from("user_styles")
      .update({ style: updatedStyle })
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating style properties:", error);
      return false;
    }

    return true;
  }

  /**
   * Map database row to UserStyle type
   */
  private mapToUserStyle(
    data: Database["public"]["Tables"]["user_styles"]["Row"]
  ): UserStyle {
    return {
      user_id: data.user_id,
      style: data.style as UserStyle["style"],
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }
}

/**
 * Create UserStyle repository instance with Supabase client
 */
export function createUserStyleRepository(
  supabase: SupabaseClient<Database>
) {
  return new UserStyleRepository(supabase);
}
