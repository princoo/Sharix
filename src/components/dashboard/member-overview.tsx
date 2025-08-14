"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Calendar, Target, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { format, differenceInDays } from "date-fns"

interface MemberStats {
  commitment: {
    id: string
    sharesCommitted: number
    totalAmount: number
    monthlyAmount: number
    paidAmount: number
    remainingAmount: number
    status: "active" | "completed" | "cancelled"
    createdAt: string
  } | null
  payments: {
    totalPayments: number
    lastPaymentDate: string | null
    nextPaymentDue: string | null
    averagePayment: number
    onTimePayments: number
    latePayments: number
  }
  milestones: {
    quarterlyTarget: number
    quarterlyProgress: number
    yearlyTarget: number
    yearlyProgress: number
    completionDate: string | null
  }
}

interface MemberOverviewProps {
  refreshTrigger?: number
}

export function MemberOverview({ refreshTrigger }: MemberOverviewProps) {
  const [stats, setStats] = useState<MemberStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchMemberStats()
  }, [refreshTrigger])

  const fetchMemberStats = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/dashboard/member-stats", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      } else {
        setError("Failed to fetch member statistics")
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

  if (!stats?.commitment) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You don&apos;t have an active share commitment yet. Visit the Shares page to get started.
        </AlertDescription>
      </Alert>
    )
  }

  const { commitment, payments, milestones } = stats
  const progressPercentage = (commitment.paidAmount / commitment.totalAmount) * 100
  const isCompleted = commitment.status === "completed" || commitment.remainingAmount <= 0

  // Calculate days until next payment
  const daysUntilNextPayment = payments.nextPaymentDue
    ? differenceInDays(new Date(payments.nextPaymentDue), new Date())
    : null

  const paymentStatus = daysUntilNextPayment !== null ? (daysUntilNextPayment < 0 ? "overdue" : "upcoming") : "none"

  return (
    <div className="space-y-6">
      {/* Main Commitment Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Your Share Commitment</span>
            </div>
            <Badge variant={isCompleted ? "default" : "secondary"} className="bg-blue-600">
              {isCompleted ? "Completed" : "Active"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{commitment.sharesCommitted}</div>
              <div className="text-sm text-gray-600">Shares Committed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${commitment.paidAmount.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Amount Paid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">${commitment.remainingAmount.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">${commitment.monthlyAmount.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Monthly Payment</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to Goal</span>
              <span>{progressPercentage.toFixed(1)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${commitment.paidAmount.toFixed(2)}</span>
              <span>${commitment.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Completion Estimate */}
          {!isCompleted && milestones.completionDate && (
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Estimated Completion:</span>
                <span className="text-sm text-gray-600">
                  {format(new Date(milestones.completionDate), "MMMM yyyy")}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Status & Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Payment Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Next Payment Due */}
              {payments.nextPaymentDue && (
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Next Payment Due</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {format(new Date(payments.nextPaymentDue), "MMM dd, yyyy")}
                    </div>
                    <div
                      className={`text-xs ${
                        paymentStatus === "overdue"
                          ? "text-red-600"
                          : paymentStatus === "upcoming"
                            ? "text-orange-600"
                            : "text-gray-500"
                      }`}
                    >
                      {daysUntilNextPayment !== null
                        ? daysUntilNextPayment < 0
                          ? `${Math.abs(daysUntilNextPayment)} days overdue`
                          : daysUntilNextPayment === 0
                            ? "Due today"
                            : `${daysUntilNextPayment} days remaining`
                        : ""}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold">{payments.totalPayments}</div>
                  <div className="text-xs text-gray-600">Total Payments</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold">${payments.averagePayment.toFixed(2)}</div>
                  <div className="text-xs text-gray-600">Average Payment</div>
                </div>
              </div>

              {/* Payment Performance */}
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">On-Time Payments</span>
                  <span className="text-sm font-bold text-green-800">
                    {payments.totalPayments > 0
                      ? ((payments.onTimePayments / payments.totalPayments) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {payments.onTimePayments} of {payments.totalPayments} payments on time
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Milestones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Quarterly Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Quarterly Goal</span>
                  <span>
                    ${milestones.quarterlyProgress.toFixed(2)} / ${milestones.quarterlyTarget.toFixed(2)}
                  </span>
                </div>
                <Progress value={(milestones.quarterlyProgress / milestones.quarterlyTarget) * 100} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">
                  {((milestones.quarterlyProgress / milestones.quarterlyTarget) * 100).toFixed(1)}% of quarterly target
                </div>
              </div>

              {/* Yearly Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Yearly Goal</span>
                  <span>
                    ${milestones.yearlyProgress.toFixed(2)} / ${milestones.yearlyTarget.toFixed(2)}
                  </span>
                </div>
                <Progress value={(milestones.yearlyProgress / milestones.yearlyTarget) * 100} className="h-2" />
                <div className="text-xs text-gray-500 mt-1">
                  {((milestones.yearlyProgress / milestones.yearlyTarget) * 100).toFixed(1)}% of yearly target
                </div>
              </div>

              {/* Achievement Badge */}
              {progressPercentage >= 25 && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      {progressPercentage >= 75
                        ? "Almost There!"
                        : progressPercentage >= 50
                          ? "Halfway Champion!"
                          : "Great Start!"}
                    </span>
                  </div>
                  <div className="text-xs text-blue-600 mt-1">Keep up the excellent progress!</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
