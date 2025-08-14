"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { OverviewStats } from "@/components/dashboard/overview-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { InviteUserDialog } from "@/components/user-management/invite-user-dialog"

export default function ManagerDashboard() {
  const { data: session } = useSession()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showInviteDialog, setShowInviteDialog] = useState(false)

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleInviteUser = () => {
    setShowInviteDialog(true)
  }

  const handleInviteSuccess = () => {
    setShowInviteDialog(false)
    handleRefresh()
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of system performance and member activity</p>
      </div>

      {/* Overview Statistics */}
      <OverviewStats refreshTrigger={refreshTrigger} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity refreshTrigger={refreshTrigger} />
        </div>

        {/* Right Column - Quick Actions & Alerts */}
        <div className="space-y-6">
          <QuickActions onInviteUser={handleInviteUser} />
          <AlertsPanel refreshTrigger={refreshTrigger} />
        </div>
      </div>

      {/* Invite User Dialog */}
      {showInviteDialog && <InviteUserDialog onInviteSuccess={handleInviteSuccess} />}
    </div>
  )
}
