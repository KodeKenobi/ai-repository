import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, companyName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create user using Supabase Auth
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
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
