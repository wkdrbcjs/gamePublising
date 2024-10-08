
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      tb_news_mst: {
        Row: {
          created_at: string
          news_gamelogo: string | null
          news_html: string | null
          news_serial_num: number
          news_title: string | null
          news_type: string | null
        }
        Insert: {
          created_at?: string
          news_gamelogo?: string | null
          news_html?: string | null
          news_serial_num?: number
          news_title?: string | null
          news_type?: string | null
        }
        Update: {
          created_at?: string
          news_gamelogo?: string | null
          news_html?: string | null
          news_serial_num?: number
          news_title?: string | null
          news_type?: string | null
        }
        Relationships: []
      }
      tb_user_mst: {
        Row: {
          create_at: string | null
          is_email_rcv: number | null
          update_at: string | null
          user_auth_id: string
          user_email: string | null
          user_nick: string | null
          user_point: number | null
          user_prof_img: string | null
          user_serial_num: number
        }
        Insert: {
          create_at?: string | null
          is_email_rcv?: number | null
          update_at?: string | null
          user_auth_id?: string
          user_email?: string | null
          user_nick?: string | null
          user_point?: number | null
          user_prof_img?: string | null
          user_serial_num?: number
        }
        Update: {
          create_at?: string | null
          is_email_rcv?: number | null
          update_at?: string | null
          user_auth_id?: string
          user_email?: string | null
          user_nick?: string | null
          user_point?: number | null
          user_prof_img?: string | null
          user_serial_num?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      func_news_get: {
        Args: {
          p_get_count?: number
        }
        Returns: {
          created_at: string
          news_gamelogo: string | null
          news_html: string | null
          news_serial_num: number
          news_title: string | null
          news_type: string | null
        }[]
      }
      func_user_put: {
        Args: {
          p_user_serial_num: number
          p_user_email: string
          p_user_nick: string
          p_user_auth_id: string
          p_user_point: number
          p_user_prof_img: string
          p_is_email_rcv: number
          p_create_at: string
          p_update_at: string
        }
        Returns: {
          rst_val: number
          op: string
          func_name: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
