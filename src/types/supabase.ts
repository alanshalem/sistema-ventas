/* Supabase-specific Types */

export type SupabaseResponse<T> = {
  data: T | null
  error: Error | null
}

// RPC function parameter types
export interface RPCParams {
  [key: string]: unknown
}
