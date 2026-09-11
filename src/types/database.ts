export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      albums: {
        Row: {
          couple_space_id: string;
          cover_path: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          couple_space_id: string;
          cover_path?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          couple_space_id?: string;
          cover_path?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "albums_couple_space_id_fkey";
            columns: ["couple_space_id"];
            isOneToOne: false;
            referencedRelation: "couple_spaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "albums_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      couple_invitations: {
        Row: {
          code: string;
          couple_space_id: string;
          created_at: string;
          created_by: string;
          expires_at: string;
          id: string;
          used_at: string | null;
          used_by: string | null;
        };
        Insert: {
          code: string;
          couple_space_id: string;
          created_at?: string;
          created_by: string;
          expires_at?: string;
          id?: string;
          used_at?: string | null;
          used_by?: string | null;
        };
        Update: {
          code?: string;
          couple_space_id?: string;
          created_at?: string;
          created_by?: string;
          expires_at?: string;
          id?: string;
          used_at?: string | null;
          used_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "couple_invitations_couple_space_id_fkey";
            columns: ["couple_space_id"];
            isOneToOne: false;
            referencedRelation: "couple_spaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "couple_invitations_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "couple_invitations_used_by_fkey";
            columns: ["used_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      couple_members: {
        Row: {
          couple_space_id: string;
          id: string;
          joined_at: string;
          user_id: string;
        };
        Insert: {
          couple_space_id: string;
          id?: string;
          joined_at?: string;
          user_id: string;
        };
        Update: {
          couple_space_id?: string;
          id?: string;
          joined_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "couple_members_couple_space_id_fkey";
            columns: ["couple_space_id"];
            isOneToOne: false;
            referencedRelation: "couple_spaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "couple_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      couple_spaces: {
        Row: {
          cover_path: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          cover_path?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Update: {
          cover_path?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "couple_spaces_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      memories: {
        Row: {
          album_id: string | null;
          captured_at: string;
          couple_space_id: string;
          created_at: string;
          created_by: string | null;
          duration_seconds: number | null;
          file_size_bytes: number;
          height: number | null;
          id: string;
          is_favorite: boolean;
          media_type: string;
          storage_path: string;
          thumbnail_path: string;
          title: string | null;
          updated_at: string;
          width: number | null;
        };
        Insert: {
          album_id?: string | null;
          captured_at?: string;
          couple_space_id: string;
          created_at?: string;
          created_by?: string | null;
          duration_seconds?: number | null;
          file_size_bytes: number;
          height?: number | null;
          id?: string;
          is_favorite?: boolean;
          media_type: string;
          storage_path: string;
          thumbnail_path: string;
          title?: string | null;
          updated_at?: string;
          width?: number | null;
        };
        Update: {
          album_id?: string | null;
          captured_at?: string;
          couple_space_id?: string;
          created_at?: string;
          created_by?: string | null;
          duration_seconds?: number | null;
          file_size_bytes?: number;
          height?: number | null;
          id?: string;
          is_favorite?: boolean;
          media_type?: string;
          storage_path?: string;
          thumbnail_path?: string;
          title?: string | null;
          updated_at?: string;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "memories_album_id_fkey";
            columns: ["album_id"];
            isOneToOne: false;
            referencedRelation: "albums";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "memories_couple_space_id_fkey";
            columns: ["couple_space_id"];
            isOneToOne: false;
            referencedRelation: "couple_spaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "memories_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      playback_progress: {
        Row: {
          couple_space_id: string;
          duration_seconds: number;
          id: string;
          memory_id: string;
          position_seconds: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          couple_space_id: string;
          duration_seconds: number;
          id?: string;
          memory_id: string;
          position_seconds: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          couple_space_id?: string;
          duration_seconds?: number;
          id?: string;
          memory_id?: string;
          position_seconds?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "playback_progress_couple_space_id_fkey";
            columns: ["couple_space_id"];
            isOneToOne: false;
            referencedRelation: "couple_spaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "playback_progress_memory_id_fkey";
            columns: ["memory_id"];
            isOneToOne: false;
            referencedRelation: "memories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "playback_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_path: string | null;
          created_at: string;
          display_name: string;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_path?: string | null;
          created_at?: string;
          display_name: string;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_path?: string | null;
          created_at?: string;
          display_name?: string;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_couple_invitation: {
        Args: { p_couple_space_id: string };
        Returns: {
          code: string;
          couple_space_id: string;
          created_at: string;
          created_by: string;
          expires_at: string;
          id: string;
          used_at: string | null;
          used_by: string | null;
        };
        SetofOptions: {
          from: "*";
          to: "couple_invitations";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      create_couple_space: {
        Args: { p_name?: string };
        Returns: {
          cover_path: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          name: string;
          updated_at: string;
        };
        SetofOptions: {
          from: "*";
          to: "couple_spaces";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      delete_own_account: { Args: never; Returns: undefined };
      get_couple_space_years: {
        Args: { p_couple_space_id: string };
        Returns: {
          year: number;
        }[];
      };
      is_couple_member: {
        Args: { p_couple_space_id: string };
        Returns: boolean;
      };
      is_couple_partner_of: { Args: { p_user_id: string }; Returns: boolean };
      join_couple_space: {
        Args: { p_code: string };
        Returns: {
          cover_path: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          name: string;
          updated_at: string;
        };
        SetofOptions: {
          from: "*";
          to: "couple_spaces";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      leave_couple_space: { Args: never; Returns: undefined };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
