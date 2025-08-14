"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { UserPlus, DollarSign, TrendingUp, Mail, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  type:
    | "user_invited"
    | "user_joined"
    | "commitment_created"
    | "payment_made"
    | "payment_confirmed"
    | "payment_rejected"
  title: string
  description: string
  userId: string
  userName: string
  userEmail: string
  amount?: number
  timestamp: string
  status?: "pending" | "confirmed" | "rejected"
}

interface RecentActivityProps {
  refreshTrigger?: number
}

export function RecentActivity({ refreshTrigger }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchRecentActivity()
  }, [refreshTrigger])

  const fetchRecentActivity = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/dashboard/activity", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities)
      } else {
        setError("Failed to fetch recent activity")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "user_invited":
        return <Mail className="h-4 w-4 text-blue-500" />
      case "user_joined":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "commitment_created":
        return <TrendingUp className="h-4 w-4 text-purple-500" />
      case "payment_made":
        return <DollarSign className="h-4 w-4 text-orange-500" />
      case "payment_confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "payment_rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityBadge = (type: ActivityItem["type"], status?: string) => {
    switch (type) {
      case "user_invited":
        return <Badge variant="outline">Invitation</Badge>
      case "user_joined":
        return <Badge variant="default">New User</Badge>
      case "commitment_created":
        return <Badge variant="secondary">Commitment</Badge>
      case "payment_made":
        return (
          <Badge variant={status === "confirmed" ? "default" : status === "rejected" ? "destructive" : "secondary"}>
            Payment
          </Badge>
        )
      case "payment_confirmed":
        return <Badge variant="default">Confirmed</Badge>
      case "payment_rejected":
        return <Badge variant="destructive">Rejected</Badge>
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

  const displayedActivities = showAll ? activities : activities.slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system activity and member actions</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {displayedActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No recent activity</div>
          ) : (
            displayedActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-gray-50/50">
                <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      {getActivityBadge(activity.type, activity.status)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{activity.userName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-xs font-medium">{activity.userName}</span>
                        <span className="text-xs text-gray-500 ml-1">({activity.userEmail})</span>
                      </div>
                    </div>

                    {activity.amount && (
                      <div className="text-sm font-medium text-green-600">${activity.amount.toFixed(2)}</div>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}

          {activities.length > 10 && (
            <div className="text-center pt-4">
              <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Show Less" : `Show All (${activities.length})`}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
