"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

const usersData = [
  {
    id: 1,
    name: "Ineza Prince",
    email: "ineza.prince@example.com",
    status: "active",
    dateJoined: "2024-01-15",
    totalContributions: 12500,
  },
  {
    id: 2,
    name: "Uwase Aline",
    email: "uwase.aline@example.com",
    status: "active",
    dateJoined: "2024-02-20",
    totalContributions: 8900,
  },
  {
    id: 3,
    name: "Nshimiyimana Eric",
    email: "nshimiyimana.eric@example.com",
    status: "inactive",
    dateJoined: "2024-03-10",
    totalContributions: 5400,
  },
  {
    id: 4,
    name: "Mukamana Divine",
    email: "mukamana.divine@example.com",
    status: "active",
    dateJoined: "2024-01-05",
    totalContributions: 15200,
  },
  {
    id: 5,
    name: "Habimana Jean Claude",
    email: "habimana.jeanclaude@example.com",
    status: "active",
    dateJoined: "2024-04-12",
    totalContributions: 3200,
  },
  {
    id: 6,
    name: "Umutoni Keza",
    email: "umutoni.keza@example.com",
    status: "active",
    dateJoined: "2024-02-28",
    totalContributions: 9800,
  },
  {
    id: 7,
    name: "Rwema Patrick",
    email: "rwema.patrick@example.com",
    status: "active",
    dateJoined: "2024-03-15",
    totalContributions: 11400,
  },
  {
    id: 8,
    name: "Mutesi Ange",
    email: "mutesi.ange@example.com",
    status: "inactive",
    dateJoined: "2024-01-22",
    totalContributions: 4700,
  },
];

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = usersData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-primary text-lg">Users</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and view all registered users
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead className="text-right">
                  Total Contributions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.dateJoined).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {user.totalContributions.toLocaleString()} &nbsp;RWF
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
