import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      nodeEnv: process.env.NODE_ENV
    }

    return NextResponse.json({
      message: 'Environment check',
      ...envCheck
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Environment check failed', details: error.message },
      { status: 500 }
    )
  }
}
