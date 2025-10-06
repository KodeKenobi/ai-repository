import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test environment variables
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Missing',
      nodeEnv: process.env.NODE_ENV
    }

    // Test Supabase client creation
    let supabaseClient = null
    let supabaseError = null
    
    try {
      const { createClient } = await import('@supabase/supabase-js')
      supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )
    } catch (error) {
      supabaseError = error.message
    }

    // Test a simple Supabase query
    let queryResult = null
    let queryError = null
    
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('users')
          .select('count')
          .limit(1)
        
        if (error) {
          queryError = error.message
        } else {
          queryResult = 'Success'
        }
      } catch (error) {
        queryError = error.message
      }
    }

    return NextResponse.json({
      message: 'Debug information',
      envCheck,
      supabaseClient: supabaseClient ? 'Created successfully' : 'Failed to create',
      supabaseError,
      queryResult,
      queryError
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Debug failed', 
        message: error.message,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}
