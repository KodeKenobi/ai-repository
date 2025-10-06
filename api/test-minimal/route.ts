import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("Minimal test endpoint called");
    
    // Test environment variables
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };
    
    console.log("Environment check:", envCheck);
    
    // Test Supabase import
    console.log("Attempting to import Supabase...");
    const { getSupabaseAdmin } = await import("@/lib/supabase");
    console.log("Supabase import successful");
    
    // Test Supabase client creation
    console.log("Attempting to create Supabase client...");
    const supabaseAdmin = getSupabaseAdmin();
    console.log("Supabase client created successfully");
    
    return NextResponse.json({
      success: true,
      message: "All tests passed",
      envCheck,
    });
  } catch (error) {
    console.error("Minimal test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
