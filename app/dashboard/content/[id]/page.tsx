import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import ContentDetailPage from "@/components/content/content-detail-page";

export const dynamic = "force-dynamic";

interface ContentDetailPageProps {
  params: {
    id: string;
  };
}

export default async function DashboardContentDetailPage({
  params,
}: ContentDetailPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Loading...</div>;
  }

  // TODO: Implement with Supabase
  const contentItem = null;

  if (!contentItem) {
    notFound();
  }

  return <ContentDetailPage contentItem={contentItem} />;
}
