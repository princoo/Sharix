"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, History, FileText, Calendar, Target } from "lucide-react"
import Link from "next/link"

interface MemberQuickActionsProps {
  hasActiveCommitment?: boolean
  nextPaymentDue?: string | null
  remainingAmount?: number
}

export function MemberQuickActions({
  hasActiveCommitment = false,
  nextPaymentDue,
  remainingAmount = 0,
}: MemberQuickActionsProps) {
  const isPaymentOverdue = nextPaymentDue && new Date(nextPaymentDue) < new Date()

  const actions = [
    {
      title: "Record Payment",
      description: hasActiveCommitment ? "Log your latest payment" : "Create commitment first",
      icon: DollarSign,
      href: "/dashboard/member/payments",
      variant: isPaymentOverdue ? ("destructive" as const) : ("default" as const),
      disabled: !hasActiveCommitment,
      urgent: isPaymentOverdue,
    },
    {
      title: "Manage Shares",
      description: hasActiveCommitment ? "Update your commitment" : "Start your commitment",
      icon: TrendingUp,
      href: "/dashboard/member/shares",
      variant: "outline" as const,
      disabled: false,
    },
    {
      title: "Payment History",
      description: "View all your payments",
      icon: History,
      href: "/dashboard/member/payments?tab=history",
      variant: "outline" as const,
      disabled: false,
    },
    {
      title: "Download Statement",
      description: "Get payment summary",
      icon: FileText,
      action: () => {
        // This would trigger a download
        console.log("Download statement")
      },
      variant: "outline" as const,
      disabled: !hasActiveCommitment,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Quick Actions</span>
        </CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            const content = (
              <Button
                variant={action.variant}
                className={`h-auto p-4 flex flex-col items-start space-y-2 w-full relative ${
                  action.disabled ? "opacity-50 cursor-not-allowed" : ""
                } ${action.urgent ? "ring-2 ring-red-500 ring-offset-2" : ""}`}
                onClick={action.action}
                disabled={action.disabled}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className="h-5 w-5" />
                  {action.urgent && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 animate-pulse">Overdue</span>
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Button>
            )

            if (action.href && !action.disabled) {
              return (
                <Link key={index} href={action.href}>
                  {content}
                </Link>
              )
            }

            return <div key={index}>{content}</div>
          })}
        </div>

        {/* Payment Reminder */}
        {hasActiveCommitment && remainingAmount > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Payment Reminder</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              You have ${remainingAmount.toFixed(2)} remaining on your commitment.
              {nextPaymentDue && (
                <>
                  {" "}
                  Next payment {isPaymentOverdue ? "was" : "is"} due {new Date(nextPaymentDue).toLocaleDateString()}.
                </>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
