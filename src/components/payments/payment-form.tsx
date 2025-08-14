"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, DollarSign, CreditCard, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface UserCommitment {
  id: string
  sharesCommitted: number
  totalAmount: number
  monthlyAmount: number
  paidAmount: number
  remainingAmount: number
  status: "active" | "completed" | "cancelled"
}

interface PaymentFormProps {
  onPaymentSuccess?: () => void
}

export function PaymentForm({ onPaymentSuccess }: PaymentFormProps) {
  const [commitment, setCommitment] = useState<UserCommitment | null>(null)
  const [amount, setAmount] = useState("")
  const [paymentDate, setPaymentDate] = useState<Date>(new Date())
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer")
  const [reference, setReference] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchCommitment()
  }, [])

  const fetchCommitment = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/shares/my-commitment", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setCommitment(data.commitment)
        // Set suggested amount to monthly payment
        if (data.commitment?.monthlyAmount) {
          setAmount(data.commitment.monthlyAmount.toString())
        }
      }
    } catch (error) {
      setError("Failed to load commitment information")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          paymentDate: paymentDate.toISOString(),
          paymentMethod,
          reference,
          notes,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Payment recorded successfully!")
        // Reset form
        setAmount(commitment?.monthlyAmount.toString() || "")
        setPaymentDate(new Date())
        setReference("")
        setNotes("")
        // Refresh commitment data
        fetchCommitment()
        onPaymentSuccess?.()
      } else {
        setError(data.message || "Failed to record payment")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (!commitment) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You don&apos;t have an active share commitment. Please create a commitment first to record payments.
        </AlertDescription>
      </Alert>
    )
  }

  if (commitment.status !== "active") {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Your share commitment is not active. Contact a manager for assistance.</AlertDescription>
      </Alert>
    )
  }

  const paymentAmount = Number.parseFloat(amount) || 0
  const willExceedCommitment = paymentAmount > commitment.remainingAmount

  return (
    <div className="space-y-6">
      {/* Commitment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Your Commitment</span>
          </CardTitle>
          <CardDescription>Current payment status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{commitment.sharesCommitted}</div>
              <div className="text-sm text-gray-500">Shares</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">${commitment.paidAmount.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Paid</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">${commitment.remainingAmount.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">${commitment.monthlyAmount.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Monthly</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{((commitment.paidAmount / commitment.totalAmount) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(commitment.paidAmount / commitment.totalAmount) * 100}%` }}
              />
            </div>
          </div>

          {commitment.remainingAmount <= 0 && (
            <div className="mt-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CreditCard className="h-3 w-3 mr-1" />
                Commitment Completed!
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Form */}
      {commitment.remainingAmount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Record Payment</CardTitle>
            <CardDescription>Log a payment towards your share commitment</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {willExceedCommitment && paymentAmount > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Payment amount (${paymentAmount.toFixed(2)}) exceeds remaining balance ($
                    {commitment.remainingAmount.toFixed(2)})
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0.01"
                    max={commitment.remainingAmount}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    disabled={submitting}
                  />
                  <p className="text-sm text-gray-500">
                    Suggested: ${commitment.monthlyAmount.toFixed(2)} | Max: ${commitment.remainingAmount.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Payment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !paymentDate && "text-muted-foreground",
                        )}
                        disabled={submitting}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {paymentDate ? format(paymentDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={paymentDate}
                        onSelect={(date) => date && setPaymentDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={submitting}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference">Reference/Transaction ID</Label>
                  <Input
                    id="reference"
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Optional reference number"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes about this payment"
                  disabled={submitting}
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting || !amount || paymentAmount <= 0 || willExceedCommitment}
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Recording payment...
                  </>
                ) : (
                  "Record Payment"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
