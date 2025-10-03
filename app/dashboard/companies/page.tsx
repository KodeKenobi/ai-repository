import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CompanySearch from "@/components/search/company-search";

export const dynamic = 'force-dynamic'

export default async function CompaniesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Loading...</div>;
  }

  return <CompanySearch userId={session.user.id} />;
}
