"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Filter, Download, Eye } from "lucide-react"
import { format } from "date-fns"

interface Payment {
  id: string
  userId: string
  userName: string
  userEmail: string
  amount: number
  paymentDate: string
  paymentMethod: string
  reference: string | null
  notes: string | null
  status: "pending" | "confirmed" | "rejected"
  createdAt: string
  confirmedBy: string | null
  confirmedAt: string | null
}

interface PaymentHistoryProps {
  userId?: string // If provided, show only payments for this user
  showUserInfo?: boolean // Whether to show user information columns
  refreshTrigger?: number
}

export function PaymentHistory({ userId, showUserInfo = true, refreshTrigger }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState({
    status: "all",
    method: "all",
    search: "",
  })

  useEffect(() => {
    fetchPayments()
  }, [userId, refreshTrigger])

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const url = userId ? `/api/payments/user/${userId}` : "/api/payments"

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments)
      } else {
        setError("Failed to fetch payment history")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (paymentId: string, status: "confirmed" | "rejected") => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/payments/${paymentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        // Update local state
        setPayments(
          payments.map((payment) =>
            payment.id === paymentId ? { ...payment, status, confirmedAt: new Date().toISOString() } : payment,
          ),
        )
      } else {
        setError("Failed to update payment status")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = filter.status === "all" || payment.status === filter.status
    const matchesMethod = filter.method === "all" || payment.paymentMethod === filter.method
    const matchesSearch =
      filter.search === "" ||
      payment.userName.toLowerCase().includes(filter.search.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(filter.search.toLowerCase()) ||
      (payment.reference && payment.reference.toLowerCase().includes(filter.search.toLowerCase()))

    return matchesStatus && matchesMethod && matchesSearch
  })

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const confirmedAmount = filteredPayments
    .filter((p) => p.status === "confirmed")
    .reduce((sum, payment) => sum + payment.amount, 0)

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPayments.length}</div>
            <p className="text-xs text-muted-foreground">Payment records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${confirmedAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Confirmed payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filter.status} onValueChange={(value) => setFilter({ ...filter, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <Select value={filter.method} onValueChange={(value) => setFilter({ ...filter, method: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showUserInfo && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search by name, email, or reference"
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            {filteredPayments.length} of {payments.length} payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {showUserInfo && <TableHead>Member</TableHead>}
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={showUserInfo ? 7 : 6} className="text-center py-8 text-gray-500">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      {showUserInfo && (
                        <TableCell>
                          <div>
                            <div className="font-medium">{payment.userName}</div>
                            <div className="text-sm text-gray-500">{payment.userEmail}</div>
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{format(new Date(payment.paymentDate), "MMM dd, yyyy")}</TableCell>
                      <TableCell className="capitalize">{payment.paymentMethod.replace("_", " ")}</TableCell>
                      <TableCell>{payment.reference || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === "confirmed"
                              ? "default"
                              : payment.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {payment.status === "pending" && showUserInfo && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updatePaymentStatus(payment.id, "confirmed")}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updatePaymentStatus(payment.id, "rejected")}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
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
