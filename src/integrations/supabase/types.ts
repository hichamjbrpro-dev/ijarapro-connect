export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      contracts: {
        Row: {
          created_at: string
          end_date: string
          file_url: string | null
          id: string
          rent_amount: number
          start_date: string
          tenant_id: string
          unit_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          file_url?: string | null
          id?: string
          rent_amount?: number
          start_date: string
          tenant_id: string
          unit_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          file_url?: string | null
          id?: string
          rent_amount?: number
          start_date?: string
          tenant_id?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          message_fr: string | null
          owner_id: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          message_fr?: string | null
          owner_id?: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          message_fr?: string | null
          owner_id?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_due: number
          amount_paid: number
          created_at: string
          id: string
          month: string
          payment_date: string | null
          receipt_sent: boolean
          status: Database["public"]["Enums"]["payment_status"]
          tenant_id: string
          unit_id: string
        }
        Insert: {
          amount_due?: number
          amount_paid?: number
          created_at?: string
          id?: string
          month: string
          payment_date?: string | null
          receipt_sent?: boolean
          status?: Database["public"]["Enums"]["payment_status"]
          tenant_id: string
          unit_id: string
        }
        Update: {
          amount_due?: number
          amount_paid?: number
          created_at?: string
          id?: string
          month?: string
          payment_date?: string | null
          receipt_sent?: boolean
          status?: Database["public"]["Enums"]["payment_status"]
          tenant_id?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          city: string
          created_at: string
          id: string
          name: string
          occupied_count: number | null
          owner_id: string
          photo_url: string | null
          type: Database["public"]["Enums"]["property_type"]
          units_count: number | null
        }
        Insert: {
          address?: string
          city?: string
          created_at?: string
          id?: string
          name: string
          occupied_count?: number | null
          owner_id?: string
          photo_url?: string | null
          type?: Database["public"]["Enums"]["property_type"]
          units_count?: number | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          id?: string
          name?: string
          occupied_count?: number | null
          owner_id?: string
          photo_url?: string | null
          type?: Database["public"]["Enums"]["property_type"]
          units_count?: number | null
        }
        Relationships: []
      }
      tenants: {
        Row: {
          cin: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          move_in_date: string
          owner_id: string
          phone: string | null
          unit_id: string | null
        }
        Insert: {
          cin?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          move_in_date?: string
          owner_id?: string
          phone?: string | null
          unit_id?: string | null
        }
        Update: {
          cin?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          move_in_date?: string
          owner_id?: string
          phone?: string | null
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          area_sqm: number | null
          created_at: string
          floor: number | null
          id: string
          monthly_rent: number
          property_id: string
          status: Database["public"]["Enums"]["unit_status"]
          type: Database["public"]["Enums"]["unit_type"]
          unit_number: string
        }
        Insert: {
          area_sqm?: number | null
          created_at?: string
          floor?: number | null
          id?: string
          monthly_rent?: number
          property_id: string
          status?: Database["public"]["Enums"]["unit_status"]
          type?: Database["public"]["Enums"]["unit_type"]
          unit_number: string
        }
        Update: {
          area_sqm?: number | null
          created_at?: string
          floor?: number | null
          id?: string
          monthly_rent?: number
          property_id?: string
          status?: Database["public"]["Enums"]["unit_status"]
          type?: Database["public"]["Enums"]["unit_type"]
          unit_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      notification_type:
        | "rent_due"
        | "overdue"
        | "contract_expiring"
        | "payment_received"
      payment_status: "paid" | "unpaid" | "partial"
      property_type: "apartment_building" | "house" | "shop" | "floor"
      unit_status: "occupied" | "vacant" | "maintenance"
      unit_type: "apartment" | "shop" | "studio" | "floor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      notification_type: [
        "rent_due",
        "overdue",
        "contract_expiring",
        "payment_received",
      ],
      payment_status: ["paid", "unpaid", "partial"],
      property_type: ["apartment_building", "house", "shop", "floor"],
      unit_status: ["occupied", "vacant", "maintenance"],
      unit_type: ["apartment", "shop", "studio", "floor"],
    },
  },
} as const
