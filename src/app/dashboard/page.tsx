// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { Navigation } from "@/components/layouts/Navigation";
import { RolesEnum } from "@/enum/role";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  const userRole = session?.user.role;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {userRole === RolesEnum.MANAGER ? (
          <div>Manager Dashboard</div>
        ) : (
          <div>Member Dashboard</div>
        )}
      </main>
    </div>
  );
}
