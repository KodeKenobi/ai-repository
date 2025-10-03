
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import RegisterForm from '@/components/auth/register-form'

export const dynamic = 'force-dynamic'

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <RegisterForm />
    </div>
  )
}
