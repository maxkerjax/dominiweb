export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          content: string
          created_at: string | null
          expiry_date: string | null
          id: string
          publish_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          publish_date?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          publish_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      billing: {
        Row: {
          billing_month: string
          created_at: string
          due_date: string
          electricity_cost: number
          electricity_units: number
          id: string
          occupancy_id: string
          paid_date: string | null
          room_id: string
          room_rent: number
          status: string
          tenant_id: string
          total_amount: number
          updated_at: string
          water_cost: number
          water_units: number
        }
        Insert: {
          billing_month: string
          created_at?: string
          due_date: string
          electricity_cost?: number
          electricity_units?: number
          id?: string
          occupancy_id: string
          paid_date?: string | null
          room_id: string
          room_rent?: number
          status?: string
          tenant_id: string
          total_amount?: number
          updated_at?: string
          water_cost?: number
          water_units?: number
        }
        Update: {
          billing_month?: string
          created_at?: string
          due_date?: string
          electricity_cost?: number
          electricity_units?: number
          id?: string
          occupancy_id?: string
          paid_date?: string | null
          room_id?: string
          room_rent?: number
          status?: string
          tenant_id?: string
          total_amount?: number
          updated_at?: string
          water_cost?: number
          water_units?: number
        }
        Relationships: [
          {
            foreignKeyName: "billing_occupancy_id_fkey"
            columns: ["occupancy_id"]
            isOneToOne: false
            referencedRelation: "occupancy"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      occupancy: {
        Row: {
          check_in_date: string
          check_out_date: string | null
          created_at: string | null
          id: string
          is_current: boolean | null
          room_id: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          check_in_date: string
          check_out_date?: string | null
          created_at?: string | null
          id?: string
          is_current?: boolean | null
          room_id: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          check_in_date?: string
          check_out_date?: string | null
          created_at?: string | null
          id?: string
          is_current?: boolean | null
          room_id?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "occupancy_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "occupancy_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          occupancy_id: string
          payment_date: string
          payment_method: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          occupancy_id: string
          payment_date: string
          payment_method: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          occupancy_id?: string
          payment_date?: string
          payment_method?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_occupancy_id_fkey"
            columns: ["occupancy_id"]
            isOneToOne: false
            referencedRelation: "occupancy"
            referencedColumns: ["id"]
          },
        ]
      }
      repairs: {
        Row: {
          completed_date: string | null
          created_at: string | null
          description: string
          id: string
          repair_type: string
          reported_date: string
          room_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          completed_date?: string | null
          created_at?: string | null
          description: string
          id?: string
          repair_type: string
          reported_date?: string
          room_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          completed_date?: string | null
          created_at?: string | null
          description?: string
          id?: string
          repair_type?: string
          reported_date?: string
          room_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repairs_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          capacity: number
          created_at: string | null
          floor: number
          id: string
          price: number
          room_number: string
          room_type: string
          status: string
          updated_at: string | null
        }
        Insert: {
          capacity: number
          created_at?: string | null
          floor: number
          id?: string
          price: number
          room_number: string
          room_type: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string | null
          floor?: number
          id?: string
          price?: number
          room_number?: string
          room_type?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tenants: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          emergency_contact: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          emergency_contact?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          emergency_contact?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
