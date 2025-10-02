
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import GapAnalysisPage from '@/components/gaps/gap-analysis-page'

export const dynamic = 'force-dynamic'

export default async function DashboardGapsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return <div>Loading...</div>
  }

  const gapAnalysisReports = await prisma.gapAnalysisReport.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  const contentItems = await prisma.contentItem.findMany({
    where: { 
      userId: session.user.id,
      status: 'COMPLETED'
    },
    include: {
      transcription: true,
      insights: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return <GapAnalysisPage reports={gapAnalysisReports} contentItems={contentItems} userId={session.user.id} />
}
