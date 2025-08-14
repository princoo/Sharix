"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { DollarSign, TrendingUp, CheckCircle, Clock, Calendar } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

interface MemberActivity {
  id: string
  type: "payment_made" | "commitment_created" | "commitment_updated" | "milestone_reached"
  title: string
  description: string
  amount?: number
  timestamp: string
  status?: "pending" | "confirmed" | "rejected"
}

interface MemberActivityProps {
  refreshTrigger?: number
}

export function MemberActivity({ refreshTrigger }: MemberActivityProps) {
  const [activities, setActivities] = useState<MemberActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchMemberActivity()
  }, [refreshTrigger])

  const fetchMemberActivity = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/dashboard/member-activity", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities)
      } else {
        setError("Failed to fetch activity history")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: MemberActivity["type"]) => {
    switch (type) {
      case "payment_made":
        return <DollarSign className="h-4 w-4 text-green-500" />
      case "commitment_created":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "commitment_updated":
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      case "milestone_reached":
        return <CheckCircle className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityBadge = (type: MemberActivity["type"], status?: string) => {
    switch (type) {
      case "payment_made":
        return (
          <Badge variant={status === "confirmed" ? "default" : status === "rejected" ? "destructive" : "secondary"}>
            {status === "confirmed" ? "Confirmed" : status === "rejected" ? "Rejected" : "Pending"}
          </Badge>
        )
      case "commitment_created":
        return <Badge variant="default">New Commitment</Badge>
      case "commitment_updated":
        return <Badge variant="secondary">Updated</Badge>
      case "milestone_reached":
        return <Badge variant="default">Milestone</Badge>
      default:
        return <Badge variant="outline">Activity</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Your Recent Activity</span>
        </CardTitle>
        <CardDescription>Your contribution and payment history</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No recent activity</p>
              <p className="text-sm">Your payments and updates will appear here</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-4 rounded-lg border bg-gray-50/50">
                <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                    {getActivityBadge(activity.type, activity.status)}
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })} •{" "}
                      {format(new Date(activity.timestamp), "MMM dd, yyyy")}
                    </span>

                    {activity.amount && (
                      <span className="text-sm font-medium text-green-600">${activity.amount.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
