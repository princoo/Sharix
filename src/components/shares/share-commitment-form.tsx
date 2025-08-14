"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DollarSign, TrendingUp, Calendar } from "lucide-react"

interface ShareConfig {
  id: string
  pricePerShare: number
  maxShares: number
  availableShares: number
  isActive: boolean
}

interface UserCommitment {
  id: string
  userId: string
  sharesCommitted: number
  totalAmount: number
  monthlyAmount: number
  status: "active" | "completed" | "cancelled"
  createdAt: string
}

interface ShareCommitmentFormProps {
  onCommitmentSuccess?: () => void
}

export function ShareCommitmentForm({ onCommitmentSuccess }: ShareCommitmentFormProps) {
  const [shareConfig, setShareConfig] = useState<ShareConfig | null>(null)
  const [userCommitment, setUserCommitment] = useState<UserCommitment | null>(null)
  const [sharesWanted, setSharesWanted] = useState(1)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchShareData()
  }, [])

  useEffect(() => {
    if (shareConfig && sharesWanted > 0) {
      const totalAmount = sharesWanted * shareConfig.pricePerShare
      // Default to 12-month payment plan
      setMonthlyPayment(Math.ceil(totalAmount / 12))
    }
  }, [sharesWanted, shareConfig])

  const fetchShareData = async () => {
    try {
      const token = localStorage.getItem("auth_token")

      // Fetch share configuration
      const configResponse = await fetch("/api/shares/config", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (configResponse.ok) {
        const configData = await configResponse.json()
        setShareConfig(configData.config)
      }

      // Fetch user's current commitment
      const commitmentResponse = await fetch("/api/shares/my-commitment", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (commitmentResponse.ok) {
        const commitmentData = await commitmentResponse.json()
        setUserCommitment(commitmentData.commitment)
      }
    } catch (error) {
      setError("Failed to load share information")
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
      const response = await fetch("/api/shares/commit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sharesCommitted: sharesWanted,
          monthlyAmount: monthlyPayment,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Share commitment created successfully!")
        setUserCommitment(data.commitment)
        onCommitmentSuccess?.()
      } else {
        setError(data.message || "Failed to create commitment")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  const updateCommitment = async () => {
    setError("")
    setSuccess("")
    setSubmitting(true)

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/shares/commit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sharesCommitted: sharesWanted,
          monthlyAmount: monthlyPayment,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Share commitment updated successfully!")
        setUserCommitment(data.commitment)
        onCommitmentSuccess?.()
      } else {
        setError(data.message || "Failed to update commitment")
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

  if (!shareConfig) {
    return (
      <Alert>
        <AlertDescription>Share configuration is not available at this time.</AlertDescription>
      </Alert>
    )
  }

  if (!shareConfig.isActive) {
    return (
      <Alert>
        <AlertDescription>Share commitments are currently not available.</AlertDescription>
      </Alert>
    )
  }

  const totalAmount = sharesWanted * shareConfig.pricePerShare
  const hasExistingCommitment = userCommitment && userCommitment.status === "active"

  return (
    <div className="space-y-6">
      {/* Share Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Share Information</span>
          </CardTitle>
          <CardDescription>Current share pricing and availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${shareConfig.pricePerShare}</div>
              <div className="text-sm text-gray-500">Price per share</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{shareConfig.availableShares}</div>
              <div className="text-sm text-gray-500">Available shares</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{shareConfig.maxShares}</div>
              <div className="text-sm text-gray-500">Total shares</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Commitment */}
      {hasExistingCommitment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Your Current Commitment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-lg font-semibold">{userCommitment.sharesCommitted} shares</div>
                <div className="text-sm text-gray-500">Committed shares</div>
              </div>
              <div>
                <div className="text-lg font-semibold">${userCommitment.totalAmount}</div>
                <div className="text-sm text-gray-500">Total amount</div>
              </div>
              <div>
                <div className="text-lg font-semibold">${userCommitment.monthlyAmount}</div>
                <div className="text-sm text-gray-500">Monthly payment</div>
              </div>
            </div>
            <div className="mt-4">
              <Badge variant="default">
                <Calendar className="h-3 w-3 mr-1" />
                Since {new Date(userCommitment.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Commitment Form */}
      <Card>
        <CardHeader>
          <CardTitle>{hasExistingCommitment ? "Update Your Commitment" : "Make a Share Commitment"}</CardTitle>
          <CardDescription>
            {hasExistingCommitment
              ? "Modify your existing share commitment"
              : "Select the number of shares you want to commit to"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={
              hasExistingCommitment
                ? (e) => {
                    e.preventDefault()
                    updateCommitment()
                  }
                : handleSubmit
            }
            className="space-y-4"
          >
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shares">Number of Shares</Label>
                <Input
                  id="shares"
                  type="number"
                  min="1"
                  max={shareConfig.availableShares + (userCommitment?.sharesCommitted || 0)}
                  value={sharesWanted}
                  onChange={(e) => setSharesWanted(Number.parseInt(e.target.value) || 1)}
                  disabled={submitting}
                />
                <p className="text-sm text-gray-500">
                  Maximum: {shareConfig.availableShares + (userCommitment?.sharesCommitted || 0)} shares
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly">Monthly Payment ($)</Label>
                <Input
                  id="monthly"
                  type="number"
                  min="1"
                  max={totalAmount}
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(Number.parseInt(e.target.value) || 0)}
                  disabled={submitting}
                />
                <p className="text-sm text-gray-500">Suggested: ${Math.ceil(totalAmount / 12)} (12 months)</p>
              </div>
            </div>

            <Separator />

            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Commitment Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Shares:</span>
                  <span>{sharesWanted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per share:</span>
                  <span>${shareConfig.pricePerShare}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total amount:</span>
                  <span>${totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly payment:</span>
                  <span>${monthlyPayment}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Payment duration:</span>
                  <span>{Math.ceil(totalAmount / monthlyPayment)} months</span>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitting || sharesWanted < 1 || monthlyPayment < 1}>
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {hasExistingCommitment ? "Updating..." : "Creating commitment..."}
                </>
              ) : hasExistingCommitment ? (
                "Update Commitment"
              ) : (
                "Create Commitment"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
