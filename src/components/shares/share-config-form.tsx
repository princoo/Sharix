"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Settings, DollarSign, Hash } from "lucide-react"

interface ShareConfig {
  id: string
  pricePerShare: number
  maxShares: number
  availableShares: number
  isActive: boolean
}

interface ShareConfigFormProps {
  onConfigUpdate?: () => void
}

export function ShareConfigForm({ onConfigUpdate }: ShareConfigFormProps) {
  const [config, setConfig] = useState<ShareConfig | null>(null)
  const [pricePerShare, setPricePerShare] = useState(0)
  const [maxShares, setMaxShares] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/shares/config", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        const configData = data.config
        setConfig(configData)
        setPricePerShare(configData.pricePerShare)
        setMaxShares(configData.maxShares)
        setIsActive(configData.isActive)
      }
    } catch (error) {
      setError("Failed to load share configuration")
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
      const response = await fetch("/api/shares/config", {
        method: config ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pricePerShare,
          maxShares,
          isActive,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Share configuration updated successfully!")
        setConfig(data.config)
        onConfigUpdate?.()
      } else {
        setError(data.message || "Failed to update configuration")
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Share Configuration</span>
        </CardTitle>
        <CardDescription>Configure share pricing and availability</CardDescription>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerShare" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Price per Share ($)</span>
              </Label>
              <Input
                id="pricePerShare"
                type="number"
                min="1"
                step="0.01"
                value={pricePerShare}
                onChange={(e) => setPricePerShare(Number.parseFloat(e.target.value) || 0)}
                disabled={submitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxShares" className="flex items-center space-x-2">
                <Hash className="h-4 w-4" />
                <span>Maximum Shares</span>
              </Label>
              <Input
                id="maxShares"
                type="number"
                min="1"
                value={maxShares}
                onChange={(e) => setMaxShares(Number.parseInt(e.target.value) || 0)}
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} disabled={submitting} />
            <Label htmlFor="isActive">Enable share commitments</Label>
          </div>

          {config && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Current Status</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Available shares:</span>
                  <span>{config.availableShares}</span>
                </div>
                <div className="flex justify-between">
                  <span>Committed shares:</span>
                  <span>{config.maxShares - config.availableShares}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total value committed:</span>
                  <span>${((config.maxShares - config.availableShares) * config.pricePerShare).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={submitting || pricePerShare <= 0 || maxShares <= 0}>
            {submitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Updating configuration...
              </>
            ) : (
              "Update Configuration"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
