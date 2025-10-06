import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import GapAnalysisPage from "@/components/gaps/gap-analysis-page";

export const dynamic = "force-dynamic";

export default async function DashboardGapsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Loading...</div>;
  }

  // TODO: Implement with Supabase
  const gapAnalysisReports = [];
  const contentItems = [];

  return (
    <GapAnalysisPage
      reports={gapAnalysisReports}
      contentItems={contentItems}
      userId={session.user.id}
    />
  );
}
