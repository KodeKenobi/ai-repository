import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import InsightsPage from "@/components/insights/insights-page";

export const dynamic = "force-dynamic";

export default async function DashboardInsightsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Loading...</div>;
  }

  // TODO: Implement with Supabase
  const insights = [];

  return <InsightsPage insights={insights} />;
}
