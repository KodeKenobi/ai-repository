import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Test direct Supabase import
    const { createClient } = await import("@supabase/supabase-js");
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: "Missing environment variables",
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    return NextResponse.json({
      status: "ok",
      message: "Supabase client created successfully",
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    });
    
  } catch (error) {
    return NextResponse.json({
      error: "Failed to create Supabase client",
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
