import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Signup endpoint called");

    // Import Supabase only when needed
    const { createClient } = await import("@supabase/supabase-js");

    // Hardcoded Supabase credentials
    const supabaseUrl = "https://xazhkbgjanwakrmvpqie.supabase.co";
    const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhemhrYmdqYW53YWtybXZwcWllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE2NDc3NSwiZXhwIjoyMDc0NzQwNzc1fQ.6-hQThD69Zj5pFegUvKF-uBXFbas-aBRJsqhSgV2uSU";

    console.log("Using hardcoded Supabase credentials");

    const body = await request.json();
    const { email, password, firstName, lastName, companyName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Request body parsed successfully");

    // Create user using Supabase Auth
    console.log("Attempting to create user with Supabase Auth");
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

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

    console.log("User created successfully with Supabase Auth");

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