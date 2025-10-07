import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    console.log("Signup endpoint called");

    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
      return NextResponse.json(
        { error: "Server configuration error: Missing Supabase URL" },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
      return NextResponse.json(
        {
          error:
            "Server configuration error: Missing Supabase service role key",
        },
        { status: 500 }
      );
    }

    console.log("Environment variables check passed");

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
    const supabaseAdmin = getSupabaseAdmin();

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
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
