import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    console.log("Simple signup endpoint called");
    
    const body = await request.json();
    const { email, password, firstName, lastName, companyName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Request body parsed successfully");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("Password hashed successfully");

    // For now, just return success without database operations
    return NextResponse.json(
      {
        message: "User would be created successfully",
        user: {
          email,
          firstName,
          lastName,
          companyName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Simple signup error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
