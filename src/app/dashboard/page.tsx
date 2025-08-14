// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { auth } from "../../../auth"
import { Navigation } from "@/components/layouts/Navigation"
import { RolesEnum } from "@/enum/role"
import ManagerDashboard from "@/components/dashboard/manager-dashboard"
import MemberDashboard from "@/components/dashboard/member-dashboard"
// import { Navigation } from "@/components/layout/navigation"

// import ManagerDashboard from "@/components/dashboard/manager-dashboard"
// import MemberDashboard from "@/components/dashboard/member-dashboard"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  const userRole = session.user.role

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {userRole === RolesEnum.MANAGER ? <ManagerDashboard /> : <MemberDashboard />}
      </main>
    </div>
  )
}
