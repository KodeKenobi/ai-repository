
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import InsightsPage from '@/components/insights/insights-page'

export const dynamic = 'force-dynamic'

export default async function DashboardInsightsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return <div>Loading...</div>
  }

  const insights = await prisma.businessInsight.findMany({
    where: { userId: session.user.id },
    include: {
      contentItem: {
        select: {
          id: true,
          title: true,
          contentType: true,
          createdAt: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return <InsightsPage insights={insights} />
}
