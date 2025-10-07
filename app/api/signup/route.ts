import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Signup endpoint called - using Vercel-Supabase integration");

    const body = await request.json();
    const { email, password, firstName, lastName, companyName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Request body parsed successfully");

    // Check if we have the proper Vercel-Supabase environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log("Environment check:");
    console.log("- NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ Present" : "❌ Missing");
    console.log("- SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "✅ Present" : "❌ Missing");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log("❌ Missing required environment variables");
      return NextResponse.json(
        { 
          error: "Server configuration error",
          details: "Missing Supabase environment variables. Please check Vercel-Supabase integration."
        },
        { status: 500 }
      );
    }

    // Test if we can import Supabase dynamically
    console.log("Attempting dynamic import of Supabase...");
    const { createClient } = await import("@supabase/supabase-js");
    console.log("✅ Supabase imported successfully");

    console.log("Creating Supabase client with environment variables...");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log("✅ Supabase client created");

    console.log("Attempting to create user...");
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          first_name: firstName || null,
          last_name: lastName || null,
          company_name: companyName || null,
        },
      });

    if (authError) {
      console.error("Error creating user:", authError);
      return NextResponse.json(
        { error: "Authentication error: " + authError.message },
        { status: 500 }
      );
    }

    console.log("✅ User created successfully");

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: authData.user.id,
          email: authData.user.email,
          firstName: authData.user.user_metadata.first_name,
          lastName: authData.user.user_metadata.last_name,
          companyName: authData.user.user_metadata.company_name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        stack: error.stack,
        type: typeof error,
        name: error.name,
      },
      { status: 500 }
    );
  }
}