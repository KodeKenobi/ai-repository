
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import ContentLibraryPage from '@/components/content/content-library-page'

export const dynamic = 'force-dynamic'

export default async function DashboardContentPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return <div>Loading...</div>
  }

  const contentItems = await prisma.contentItem.findMany({
    where: { userId: session.user.id },
    include: {
      transcription: true,
      insights: {
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return <ContentLibraryPage contentItems={contentItems} />
}
