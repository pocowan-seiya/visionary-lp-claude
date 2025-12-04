import { SupabaseClient } from "@supabase/supabase-js";
import {
  LPProject,
  LPProjectInsert,
  LPProjectUpdate,
  Section,
} from "@/types";
import { Database } from "../supabase/database.types";

export class LPRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Get LP project by ID
   */
  async findById(id: string): Promise<LPProject | null> {
    const { data, error } = await this.supabase
      .from("lp_projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching LP project:", error);
      return null;
    }

    return this.mapToLPProject(data);
  }

  /**
   * Get LP project by slug
   */
  async findBySlug(slug: string): Promise<LPProject | null> {
    const { data, error } = await this.supabase
      .from("lp_projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching LP project by slug:", error);
      return null;
    }

    return this.mapToLPProject(data);
  }

  /**
   * Get all LP projects for a user
   */
  async findByUserId(userId: string): Promise<LPProject[]> {
    const { data, error } = await this.supabase
      .from("lp_projects")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching LP projects:", error);
      return [];
    }

    return data.map((item) => this.mapToLPProject(item));
  }

  /**
   * Get published LP projects (public access)
   */
  async findPublished(limit = 50): Promise<LPProject[]> {
    const { data, error } = await this.supabase
      .from("lp_projects")
      .select("*")
      .eq("status", "published")
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching published LP projects:", error);
      return [];
    }

    return data.map((item) => this.mapToLPProject(item));
  }

  /**
   * Create new LP project
   */
  async create(data: LPProjectInsert): Promise<LPProject | null> {
    const { data: created, error } = await this.supabase
      .from("lp_projects")
      .insert({
        user_id: data.user_id,
        title: data.title,
        slug: data.slug,
        status: data.status || "draft",
        theme: data.theme || {},
        sections: data.sections || [],
        meta: data.meta || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating LP project:", error);
      return null;
    }

    return this.mapToLPProject(created);
  }

  /**
   * Update LP project
   */
  async update(id: string, data: LPProjectUpdate): Promise<LPProject | null> {
    const { data: updated, error } = await this.supabase
      .from("lp_projects")
      .update({
        ...(data.title !== undefined && { title: data.title }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.theme !== undefined && { theme: data.theme }),
        ...(data.sections !== undefined && { sections: data.sections }),
        ...(data.meta !== undefined && { meta: data.meta }),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating LP project:", error);
      return null;
    }

    return this.mapToLPProject(updated);
  }

  /**
   * Upsert LP project (create or update)
   */
  async upsert(data: LPProjectInsert): Promise<LPProject | null> {
    const { data: upserted, error } = await this.supabase
      .from("lp_projects")
      .upsert(
        {
          ...(data.id && { id: data.id }),
          user_id: data.user_id,
          title: data.title,
          slug: data.slug,
          status: data.status || "draft",
          theme: data.theme || {},
          sections: data.sections || [],
          meta: data.meta || {},
        },
        {
          onConflict: "id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error upserting LP project:", error);
      return null;
    }

    return this.mapToLPProject(upserted);
  }

  /**
   * Delete LP project
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("lp_projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting LP project:", error);
      return false;
    }

    return true;
  }

  /**
   * Update sections only
   */
  async updateSections(id: string, sections: Section[]): Promise<boolean> {
    const { error } = await this.supabase
      .from("lp_projects")
      .update({ sections })
      .eq("id", id);

    if (error) {
      console.error("Error updating sections:", error);
      return false;
    }

    return true;
  }

  /**
   * Update status only
   */
  async updateStatus(
    id: string,
    status: "draft" | "preview" | "published"
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from("lp_projects")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      return false;
    }

    return true;
  }

  /**
   * Check if slug is available
   */
  async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    let query = this.supabase.from("lp_projects").select("id").eq("slug", slug);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error checking slug availability:", error);
      return false;
    }

    return data.length === 0;
  }

  /**
   * Map database row to LPProject type
   */
  private mapToLPProject(data: Database["public"]["Tables"]["lp_projects"]["Row"]): LPProject {
    return {
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      slug: data.slug,
      status: data.status as "draft" | "preview" | "published",
      theme: data.theme as Record<string, any>,
      sections: data.sections as Section[],
      meta: data.meta as Record<string, any>,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }
}

/**
 * Create LP repository instance with Supabase client
 */
export function createLPRepository(supabase: SupabaseClient<Database>) {
  return new LPRepository(supabase);
}
