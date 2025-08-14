"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertTriangle, Clock, Users, DollarSign, X, CheckCircle } from "lucide-react"

interface SystemAlert {
  id: string
  type: "overdue_payments" | "pending_invitations" | "low_shares" | "system_issue" | "milestone"
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  count?: number
  amount?: number
  createdAt: string
  dismissed?: boolean
}

interface AlertsPanelProps {
  refreshTrigger?: number
}

export function AlertsPanel({ refreshTrigger }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAlerts()
  }, [refreshTrigger])

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/dashboard/alerts", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setAlerts(data.alerts.filter((alert: SystemAlert) => !alert.dismissed))
      } else {
        setError("Failed to fetch alerts")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const dismissAlert = async (alertId: string) => {
    try {
      const token = localStorage.getItem("auth_token")
      await fetch(`/api/dashboard/alerts/${alertId}/dismiss`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })

      // Remove from local state
      setAlerts(alerts.filter((alert) => alert.id !== alertId))
    } catch (error) {
      console.error("Failed to dismiss alert:", error)
    }
  }

  const getAlertIcon = (type: SystemAlert["type"]) => {
    switch (type) {
      case "overdue_payments":
        return <DollarSign className="h-4 w-4" />
      case "pending_invitations":
        return <Clock className="h-4 w-4" />
      case "low_shares":
        return <AlertTriangle className="h-4 w-4" />
      case "milestone":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getAlertVariant = (severity: SystemAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getSeverityColor = (severity: SystemAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Alerts</span>
          {alerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Important notifications and system status</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p>All good! No alerts at this time.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} relative`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{alert.title}</h4>
                        <Badge variant={getAlertVariant(alert.severity)} className="text-xs">
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm opacity-90">{alert.description}</p>

                      <div className="flex items-center space-x-4 mt-2 text-xs opacity-75">
                        {alert.count && (
                          <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{alert.count} affected</span>
                          </span>
                        )}
                        {alert.amount && (
                          <span className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3" />
                            <span>${alert.amount.toFixed(2)}</span>
                          </span>
                        )}
                        <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="flex-shrink-0 h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
