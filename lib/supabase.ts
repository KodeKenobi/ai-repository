import { createClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build-time errors
let _supabase: any = null
let _supabaseAdmin: any = null

export function getSupabaseClient() {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return _supabaseAdmin
}

// For backward compatibility - these will be lazy-loaded
export const supabase = new Proxy({}, {
  get(target, prop) {
    return getSupabaseClient()[prop]
  }
})

export const supabaseAdmin = new Proxy({}, {
  get(target, prop) {
    return getSupabaseAdmin()[prop]
  }
})
