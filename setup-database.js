const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables!')
  console.error('Please create .env.local file with your Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  console.log('Setting up database schema...')
  
  try {
    // Read the schema file
    const fs = require('fs')
    const schema = fs.readFileSync('./supabase-schema.sql', 'utf8')
    
    // Execute the schema
    const { data, error } = await supabase.rpc('exec_sql', { sql: schema })
    
    if (error) {
      console.error('Error setting up database:', error)
      return
    }
    
    console.log('✅ Database schema set up successfully!')
    console.log('You can now test your signup endpoint.')
    
  } catch (err) {
    console.error('Error:', err.message)
    console.log('\nPlease manually run the SQL from supabase-schema.sql in your Supabase SQL Editor')
  }
}

setupDatabase()
