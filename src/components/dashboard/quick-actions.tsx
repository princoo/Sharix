"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Settings, FileText, Mail, AlertTriangle, Download } from "lucide-react"
import Link from "next/link"

interface QuickActionsProps {
  onInviteUser?: () => void
  overdueCount?: number
}

export function QuickActions({ onInviteUser, overdueCount = 0 }: QuickActionsProps) {
  const actions = [
    {
      title: "Invite User",
      description: "Send invitation to new member",
      icon: UserPlus,
      action: onInviteUser,
      variant: "default" as const,
    },
    {
      title: "Manage Shares",
      description: "Configure share settings",
      icon: Settings,
      href: "/dashboard/manager/shares",
      variant: "outline" as const,
    },
    {
      title: "Payment Reminders",
      description: `${overdueCount} overdue payments`,
      icon: overdueCount > 0 ? AlertTriangle : Mail,
      href: "/dashboard/manager/payments",
      variant: overdueCount > 0 ? ("destructive" as const) : ("outline" as const),
      badge: overdueCount > 0 ? overdueCount : undefined,
    },
    {
      title: "Export Data",
      description: "Download reports",
      icon: Download,
      action: () => {
        // This would trigger an export function
        console.log("Export data")
      },
      variant: "outline" as const,
    },
    {
      title: "Generate Report",
      description: "Create monthly report",
      icon: FileText,
      action: () => {
        // This would trigger a report generation
        console.log("Generate report")
      },
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common management tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            const content = (
              <Button
                variant={action.variant}
                className="h-auto p-4 flex flex-col items-start space-y-2 w-full relative"
                onClick={action.action}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className="h-5 w-5" />
                  {action.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {action.badge}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Button>
            )

            if (action.href) {
              return (
                <Link key={index} href={action.href}>
                  {content}
                </Link>
              )
            }

            return <div key={index}>{content}</div>
          })}
        </div>
      </CardContent>
    </Card>
  )
}
