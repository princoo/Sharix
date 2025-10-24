"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreVertical, Search, Mail, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
type InviteStatus = "pending" | "accepted" | "declined" | "expired";

interface Invite {
  id: string;
  name: string;
  email: string;
  dateSent: string;
  status: InviteStatus;
  role: string;
}

const dummyInvites: Invite[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    dateSent: "2024-01-15",
    status: "accepted",
    role: "Member",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    dateSent: "2024-01-18",
    status: "pending",
    role: "Contributor",
  },
  {
    id: "3",
    name: "Carol White",
    email: "carol.white@example.com",
    dateSent: "2024-01-20",
    status: "pending",
    role: "Member",
  },
  {
    id: "4",
    name: "David Brown",
    email: "david.brown@example.com",
    dateSent: "2024-01-10",
    status: "accepted",
    role: "Admin",
  },
  {
    id: "5",
    name: "Emma Davis",
    email: "emma.davis@example.com",
    dateSent: "2024-01-05",
    status: "declined",
    role: "Member",
  },
  {
    id: "6",
    name: "Frank Miller",
    email: "frank.miller@example.com",
    dateSent: "2023-12-28",
    status: "expired",
    role: "Contributor",
  },
  {
    id: "7",
    name: "Grace Lee",
    email: "grace.lee@example.com",
    dateSent: "2024-01-22",
    status: "pending",
    role: "Member",
  },
  {
    id: "8",
    name: "Henry Wilson",
    email: "henry.wilson@example.com",
    dateSent: "2024-01-12",
    status: "accepted",
    role: "Contributor",
  },
];

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  accepted: {
    label: "Accepted",
    color: "bg-primary/20 text-primary border-primary/20",
  },
  declined: {
    label: "Declined",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  expired: {
    label: "Expired",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

export function InvitesTable() {
  const [invites, setInvites] = useState<Invite[]>(dummyInvites);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleResend = (invite: Invite) => {
    toast.success(`Invitation has been resent to ${invite.email}`);
  };

  const handleDelete = (inviteId: string) => {
    setInvites(invites.filter((inv) => inv.id !== inviteId));
    toast.success(`Invitation has been removed`);
  };

  const handleViewDetails = (invite: Invite) => {
    toast.info(`Viewing details for ${invite.name}`);
  };

  const filteredInvites = invites.filter((invite) => {
    const matchesSearch =
      invite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invite.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invite.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg text-primary">All Invitations</CardTitle>
        <CardDescription>View and manage all sent invitations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground shadow-one" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 shadow-none"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] shadow-none">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name / Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date Sent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvites.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    No invites found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invite.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {invite.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{invite.role}</TableCell>
                    <TableCell>
                      {new Date(invite.dateSent).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusConfig[invite.status].color}
                      >
                        {statusConfig[invite.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {(invite.status === "pending" ||
                            invite.status === "expired") && (
                            <DropdownMenuItem
                              onClick={() => handleResend(invite)}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              Resend Invite
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(invite)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(invite.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Invite
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
      </CardContent>
    </Card>
  );
}
