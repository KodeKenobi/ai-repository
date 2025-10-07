# Environment Variables Setup

Create a `.env.local` file in the `app` directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xazhkbgjanwakrmvpqie.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhemhrYmdqYW53YWtybXZwcWllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE2NDc3NSwiZXhwIjoyMDc0NzQwNzc1fQ.6-hQThD69Zj5pFegUvKF-uBXFbas-aBRJsqhSgV2uSU

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

## For Vercel Deployment

Add these same environment variables in your Vercel dashboard:

1. Go to your project settings
2. Navigate to Environment Variables
3. Add each variable with the correct values
4. Make sure to set them for Production, Preview, and Development environments

## Getting Supabase Keys

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL for `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the `anon` `public` key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy the `service_role` `secret` key for `SUPABASE_SERVICE_ROLE_KEY`
