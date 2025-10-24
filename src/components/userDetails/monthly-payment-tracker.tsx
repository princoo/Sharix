"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bell, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

// Dummy data - replace with real data later
const monthlyPayments = [
  {
    month: "January",
    expected: 100000,
    paid: 100000,
    remaining: 0,
    status: "complete",
  },
  {
    month: "February",
    expected: 100000,
    paid: 100000,
    remaining: 0,
    status: "complete",
  },
  {
    month: "March",
    expected: 100000,
    paid: 100000,
    remaining: 0,
    status: "complete",
  },
  {
    month: "April",
    expected: 100000,
    paid: 75000,
    remaining: 25000,
    status: "partial",
  },
  {
    month: "May",
    expected: 100000,
    paid: 80000,
    remaining: 20000,
    status: "partial",
  },
  {
    month: "June",
    expected: 100000,
    paid: 95000,
    remaining: 5000,
    status: "partial",
  },
  {
    month: "July",
    expected: 100000,
    paid: 100000,
    remaining: 0,
    status: "complete",
  },
  {
    month: "August",
    expected: 100000,
    paid: 100000,
    remaining: 0,
    status: "complete",
  },
  {
    month: "September",
    expected: 100000,
    paid: 100000,
    remaining: 0,
    status: "complete",
  },
  {
    month: "October",
    expected: 100000,
    paid: 0,
    remaining: 100000,
    status: "unpaid",
  },
  {
    month: "November",
    expected: 100000,
    paid: 0,
    remaining: 100000,
    status: "unpaid",
  },
  {
    month: "December",
    expected: 100000,
    paid: 0,
    remaining: 100000,
    status: "unpaid",
  },
];

export function MonthlyPaymentTracker({ userId }: { readonly userId: string }) {
  // eslint-disable-next-line no-console
  console.log(userId);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case "partial":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "unpaid":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-primary">Complete</Badge>;
      case "partial":
        return <Badge className="bg-orange-600">Partial</Badge>;
      case "unpaid":
        return <Badge variant="destructive">Unpaid</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg text-primary">
          Monthly Payment Tracker
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track monthly contribution status throughout the year
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Expected</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyPayments.map((payment) => {
                const percentage = (payment.paid / payment.expected) * 100;
                return (
                  <TableRow key={payment.month}>
                    <TableCell className="font-medium">
                      {payment.month}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.expected.toLocaleString()}&nbsp;RWF
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {payment.paid.toLocaleString()} &nbsp;RWF
                        </div>
                        <Progress value={percentage} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {payment.remaining.toLocaleString()}&nbsp;RWF
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        {getStatusBadge(payment.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status !== "complete" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                        >
                          <Bell className="h-3 w-3" />
                          Remind
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
