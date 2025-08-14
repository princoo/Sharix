"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, DollarSign, AlertTriangle, UserCheck, Clock, Target, Activity } from "lucide-react"

interface DashboardStats {
  users: {
    total: number
    active: number
    pending: number
    managers: number
    members: number
  }
  shares: {
    totalShares: number
    availableShares: number
    committedShares: number
    totalValue: number
    averageCommitment: number
  }
  payments: {
    totalPaid: number
    totalOutstanding: number
    overdueAmount: number
    overdueCount: number
    thisMonthPayments: number
    collectionRate: number
  }
  activity: {
    newUsersThisWeek: number
    newCommitmentsThisWeek: number
    paymentsThisWeek: number
    pendingInvitations: number
  }
}

interface OverviewStatsProps {
  refreshTrigger?: number
}

export function OverviewStats({ refreshTrigger }: OverviewStatsProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStats()
  }, [refreshTrigger])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      } else {
        setError("Failed to fetch dashboard statistics")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!stats) {
    return (
      <Alert>
        <AlertDescription>No statistics available</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.users.active} active, {stats.users.pending} pending
            </p>
            <div className="flex space-x-1 mt-2">
              <Badge variant="outline" className="text-xs">
                {stats.users.managers} managers
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats.users.members} members
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Share Commitments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shares.committedShares}</div>
            <p className="text-xs text-muted-foreground">of {stats.shares.totalShares} total shares</p>
            <div className="mt-2">
              <div className="text-sm font-medium">${stats.shares.totalValue.toFixed(2)}</div>
              <div className="text-xs text-gray-500">Total committed value</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${stats.payments.totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">${stats.payments.totalOutstanding.toFixed(2)} outstanding</p>
            <div className="mt-2">
              <div className="text-sm font-medium">{stats.payments.collectionRate.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">Collection rate</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.payments.overdueCount}</div>
            <p className="text-xs text-muted-foreground">members with overdue payments</p>
            <div className="mt-2">
              <div className="text-sm font-medium text-red-600">${stats.payments.overdueAmount.toFixed(2)}</div>
              <div className="text-xs text-gray-500">Overdue amount</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activity.newUsersThisWeek}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Commitments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activity.newCommitmentsThisWeek}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Payments</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activity.paymentsThisWeek}</div>
            <p className="text-xs text-muted-foreground">This week</p>
            <div className="mt-2">
              <div className="text-sm font-medium">${stats.payments.thisMonthPayments.toFixed(2)}</div>
              <div className="text-xs text-gray-500">This month</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activity.pendingInvitations}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
