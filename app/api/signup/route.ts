
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, companyName } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing user:', checkError)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const { data: user, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        first_name: firstName || null,
        last_name: lastName || null,
        company_name: companyName || null,
      })
      .select('id, email, first_name, last_name, company_name')
      .single()

    if (createError) {
      console.error('Error creating user:', createError)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          companyName: user.company_name,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
