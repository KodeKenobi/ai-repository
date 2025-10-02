
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import ConsistencyPage from '@/components/consistency/consistency-page'

export const dynamic = 'force-dynamic'

export default async function DashboardConsistencyPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return <div>Loading...</div>
  }

  const consistencyReports = await prisma.consistencyReport.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  const contentItems = await prisma.contentItem.findMany({
    where: { 
      userId: session.user.id,
      status: 'COMPLETED'
    },
    include: {
      transcription: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return <ConsistencyPage reports={consistencyReports} contentItems={contentItems} userId={session.user.id} />
}
