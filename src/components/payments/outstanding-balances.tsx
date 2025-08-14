"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, DollarSign, Clock, TrendingDown, Mail } from "lucide-react"

interface OutstandingBalance {
  userId: string
  userName: string
  userEmail: string
  sharesCommitted: number
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  monthlyAmount: number
  lastPaymentDate: string | null
  daysSinceLastPayment: number | null
  isOverdue: boolean
  overdueAmount: number
}

interface OutstandingBalancesProps {
  refreshTrigger?: number
}

export function OutstandingBalances({ refreshTrigger }: OutstandingBalancesProps) {
  const [balances, setBalances] = useState<OutstandingBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sendingReminder, setSendingReminder] = useState<string | null>(null)

  useEffect(() => {
    fetchOutstandingBalances()
  }, [refreshTrigger])

  const fetchOutstandingBalances = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/payments/outstanding", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setBalances(data.balances)
      } else {
        setError("Failed to fetch outstanding balances")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const sendPaymentReminder = async (userId: string) => {
    setSendingReminder(userId)
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/payments/reminder/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        setError("Failed to send payment reminder")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setSendingReminder(null)
    }
  }

  const totalOutstanding = balances.reduce((sum, balance) => sum + balance.remainingAmount, 0)
  const overdueCount = balances.filter((balance) => balance.isOverdue).length
  const totalOverdue = balances.reduce((sum, balance) => sum + balance.overdueAmount, 0)

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOutstanding.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{balances.length} members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Members</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalOverdue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Past due</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {balances.length > 0 ? (((balances.length - overdueCount) / balances.length) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">On time payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Balances Table */}
      <Card>
        <CardHeader>
          <CardTitle>Outstanding Balances</CardTitle>
          <CardDescription>Members with remaining payment obligations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Shares</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Monthly</TableHead>
                  <TableHead>Last Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No outstanding balances found
                    </TableCell>
                  </TableRow>
                ) : (
                  balances.map((balance) => {
                    const progressPercentage = (balance.paidAmount / balance.totalAmount) * 100

                    return (
                      <TableRow key={balance.userId}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{balance.userName}</div>
                            <div className="text-sm text-gray-500">{balance.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{balance.sharesCommitted}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>${balance.paidAmount.toFixed(2)}</span>
                              <span>${balance.totalAmount.toFixed(2)}</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                            <div className="text-xs text-gray-500">{progressPercentage.toFixed(1)}% complete</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-orange-600">
                          ${balance.remainingAmount.toFixed(2)}
                        </TableCell>
                        <TableCell>${balance.monthlyAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          {balance.lastPaymentDate ? (
                            <div>
                              <div className="text-sm">{new Date(balance.lastPaymentDate).toLocaleDateString()}</div>
                              <div className="text-xs text-gray-500">{balance.daysSinceLastPayment} days ago</div>
                            </div>
                          ) : (
                            <span className="text-gray-500">No payments</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {balance.isOverdue ? (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Overdue
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Current</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendPaymentReminder(balance.userId)}
                            disabled={sendingReminder === balance.userId}
                          >
                            {sendingReminder === balance.userId ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <>
                                <Mail className="h-4 w-4 mr-1" />
                                Remind
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
