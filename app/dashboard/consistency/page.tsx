import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ConsistencyPage from "@/components/consistency/consistency-page";

export const dynamic = "force-dynamic";

export default async function DashboardConsistencyPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Loading...</div>;
  }

  // TODO: Implement with Supabase
  const consistencyReports = [];
  const contentItems = [];

  return (
    <ConsistencyPage
      reports={consistencyReports}
      contentItems={contentItems}
      userId={session.user.id}
    />
  );
}
