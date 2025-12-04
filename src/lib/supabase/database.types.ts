// This file is generated from the Supabase schema
// You can regenerate it using: npx supabase gen types typescript

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      lp_projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          slug: string;
          status: string;
          theme: Json;
          sections: Json;
          meta: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          slug: string;
          status?: string;
          theme?: Json;
          sections?: Json;
          meta?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          slug?: string;
          status?: string;
          theme?: Json;
          sections?: Json;
          meta?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lp_projects_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      lp_vision_product: {
        Row: {
          lp_id: string;
          vision: Json;
          product: Json;
          bridge: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          lp_id: string;
          vision: Json;
          product: Json;
          bridge: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          lp_id?: string;
          vision?: Json;
          product?: Json;
          bridge?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lp_vision_product_lp_id_fkey";
            columns: ["lp_id"];
            referencedRelation: "lp_projects";
            referencedColumns: ["id"];
          }
        ];
      };
      user_styles: {
        Row: {
          user_id: string;
          style: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          style: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          style?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_styles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
