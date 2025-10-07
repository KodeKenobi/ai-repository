import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase package can be imported
    const supabasePackage = await import("@supabase/supabase-js");
    
    return NextResponse.json({
      message: "Diagnostics successful",
      checks: {
        supabasePackageLoaded: !!supabasePackage,
        supabasePackageVersion: supabasePackage ? "loaded" : "not loaded",
        hardcodedUrl: "https://xazhkbgjanwakrmvpqie.supabase.co",
        hardcodedKeyPresent: true,
        nodeVersion: process.version,
        platform: process.platform,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Diagnostic error",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
