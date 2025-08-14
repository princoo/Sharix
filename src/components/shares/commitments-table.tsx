"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, Calendar } from "lucide-react"

interface Commitment {
  id: string
  userId: string
  userName: string
  userEmail: string
  sharesCommitted: number
  totalAmount: number
  monthlyAmount: number
  paidAmount: number
  remainingAmount: number
  status: "active" | "completed" | "cancelled"
  createdAt: string
  lastPaymentAt: string | null
}

interface CommitmentsStats {
  totalCommitments: number
  totalShares: number
  totalValue: number
  totalPaid: number
  totalRemaining: number
}

interface CommitmentsTableProps {
  refreshTrigger?: number
}

export function CommitmentsTable({ refreshTrigger }: CommitmentsTableProps) {
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [stats, setStats] = useState<CommitmentsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCommitments()
  }, [refreshTrigger])

  const fetchCommitments = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/shares/commitments", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setCommitments(data.commitments)
        setStats(data.stats)
      } else {
        setError("Failed to fetch commitments")
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

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commitments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCommitments}</div>
              <p className="text-xs text-muted-foreground">Active commitments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalShares}</div>
              <p className="text-xs text-muted-foreground">Committed shares</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Committed value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRemaining.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Remaining balance</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Commitments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Share Commitments</CardTitle>
          <CardDescription>All member share commitments and payment status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Shares</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Monthly</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commitments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No commitments found
                    </TableCell>
                  </TableRow>
                ) : (
                  commitments.map((commitment) => (
                    <TableRow key={commitment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{commitment.userName}</div>
                          <div className="text-sm text-gray-500">{commitment.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{commitment.sharesCommitted}</TableCell>
                      <TableCell>${commitment.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-green-600">${commitment.paidAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-orange-600">${commitment.remainingAmount.toFixed(2)}</TableCell>
                      <TableCell>${commitment.monthlyAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            commitment.status === "active"
                              ? "default"
                              : commitment.status === "completed"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {commitment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {commitment.lastPaymentAt ? (
                          new Date(commitment.lastPaymentAt).toLocaleDateString()
                        ) : (
                          <span className="text-gray-500">No payments</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
