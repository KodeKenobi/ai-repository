
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import UploadPage from '@/components/upload/upload-page'

export default async function DashboardUploadPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return <div>Loading...</div>
  }

  return <UploadPage userId={session.user.id} />
}
