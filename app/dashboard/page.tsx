import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardOverview from "@/components/dashboard/overview";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Loading...</div>;
  }

  // Mock data for now - replace with Supabase calls later
  const contentItems = [
    {
      id: "1",
      title: "Coca Cola Company Analysis",
      contentType: "DOCUMENT",
      type: "DOCUMENT",
      status: "COMPLETED",
      source: "DIRECT_TEXT",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: session.user.id,
      transcription: { content: "Coca Cola is a global beverage company..." },
      insights: [],
    },
    {
      id: "2",
      title: "Market Research Report",
      contentType: "DOCUMENT",
      type: "DOCUMENT",
      status: "COMPLETED",
      source: "DIRECT_TEXT",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: session.user.id,
      transcription: { content: "Market analysis shows..." },
      insights: [],
    },
  ];

  const insights = [
    {
      id: "1",
      title: "Coca Cola Market Position",
      content: "Coca Cola maintains strong market position...",
      category: "MARKET_ANALYSIS",
      priority: "HIGH",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: session.user.id,
    },
    {
      id: "2",
      title: "Competitive Landscape",
      content: "Analysis of competitors shows...",
      category: "COMPETITIVE_ANALYSIS",
      priority: "MEDIUM",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: session.user.id,
    },
  ];

  const consistencyReport = null;
  const gapAnalysisReport = null;

  const stats = {
    totalContent: 2,
    totalInsights: 2,
    processedContent: 2,
    pendingContent: 0,
  };

  return (
    <DashboardOverview
      user={session.user}
      stats={stats}
      recentContent={contentItems}
      recentInsights={insights}
      consistencyReport={consistencyReport}
      gapAnalysisReport={gapAnalysisReport}
    />
  );
}
