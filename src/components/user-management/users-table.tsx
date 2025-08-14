"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { MoreHorizontal, Mail, UserCheck, UserX } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface User {
  id: string
  email: string
  name: string | null
  role: "manager" | "member"
  isActive: boolean
  invitedAt: string
  lastLoginAt: string | null
}

interface UsersTableProps {
  refreshTrigger?: number
}

export function UsersTable({ refreshTrigger }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      } else {
        setError("Failed to fetch users")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [refreshTrigger])

  const updateUserRole = async (userId: string, newRole: "manager" | "member") => {
    setUpdatingUserId(userId)
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        // Update local state
        setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
      } else {
        setError("Failed to update user role")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setUpdatingUserId(null)
    }
  }

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    setUpdatingUserId(userId)
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
      })

      if (response.ok) {
        // Update local state
        setUsers(users.map((user) => (user.id === userId ? { ...user, isActive } : user)))
      } else {
        setError("Failed to update user status")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setUpdatingUserId(null)
    }
  }

  const resendInvitation = async (userId: string) => {
    setUpdatingUserId(userId)
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/users/${userId}/resend-invite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // Show success message (you could add a toast here)
        console.log("Invitation resent successfully")
      } else {
        setError("Failed to resend invitation")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setUpdatingUserId(null)
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
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name || "Pending Setup"}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value: "manager" | "member") => updateUserRole(user.id, value)}
                      disabled={updatingUserId === user.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {!user.name && <Badge variant="outline">Pending</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.lastLoginAt ? (
                      new Date(user.lastLoginAt).toLocaleDateString()
                    ) : (
                      <span className="text-gray-500">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={updatingUserId === user.id}>
                          {updatingUserId === user.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!user.name && (
                          <DropdownMenuItem onClick={() => resendInvitation(user.id)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Resend Invite
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => toggleUserStatus(user.id, !user.isActive)}>
                          {user.isActive ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
