import type { ListStatus } from "@/types/list";

export interface Database {
  public: {
    Tables: {
      user_lists: {
        Row: {
          id: string;
          user_id: string;
          content_id: number;
          content_type: string;
          content_title: string;
          poster_path: string | null;
          backdrop_path: string | null;
          rating: number | null;
          status: ListStatus;
          added_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content_id: number;
          content_type: string;
          content_title: string;
          poster_path?: string | null;
          backdrop_path?: string | null;
          rating?: number | null;
          status: ListStatus;
          added_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content_id?: number;
          content_type?: string;
          content_title?: string;
          poster_path?: string | null;
          backdrop_path?: string | null;
          rating?: number | null;
          status?: ListStatus;
          added_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
