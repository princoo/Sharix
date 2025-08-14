"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { MemberOverview } from "@/components/dashboard/member-overview"
import { MemberActivity } from "@/components/dashboard/member-activity"
import { MemberQuickActions } from "@/components/dashboard/member-quick-actions"

interface MemberDashboardData {
  hasActiveCommitment: boolean
  nextPaymentDue: string | null
  remainingAmount: number
}

export default function MemberDashboard() {
  const { data: session } = useSession()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [dashboardData, setDashboardData] = useState<MemberDashboardData>({
    hasActiveCommitment: false,
    nextPaymentDue: null,
    remainingAmount: 0,
  })

  useEffect(() => {
    if (session?.user?.role === "member") {
      fetchDashboardData()
    }
  }, [refreshTrigger, session])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard/member-data")

      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    }
  }

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your contribution progress and manage payments</p>
      </div>

      {/* Member Overview */}
      <MemberOverview refreshTrigger={refreshTrigger} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recent Activity */}
        <div className="lg:col-span-2">
          <MemberActivity refreshTrigger={refreshTrigger} />
        </div>

        {/* Right Column - Quick Actions */}
        <div>
          <MemberQuickActions
            hasActiveCommitment={dashboardData.hasActiveCommitment}
            nextPaymentDue={dashboardData.nextPaymentDue}
            remainingAmount={dashboardData.remainingAmount}
          />
        </div>
      </div>
    </div>
  )
}
