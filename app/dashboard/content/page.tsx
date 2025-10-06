import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ContentLibraryPage from "@/components/content/content-library-page";

export const dynamic = "force-dynamic";

export default async function DashboardContentPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Loading...</div>;
  }

  // TODO: Implement with Supabase
  const contentItems = [];

  return <ContentLibraryPage contentItems={contentItems} />;
}
