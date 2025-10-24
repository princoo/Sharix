/* eslint-disable no-console */
"use client";

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye, Check, X, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Dummy data - replace with real data later
const transactions = [
  {
    id: 1,
    date: "2024-01-15",
    amount: 100000,
    month: "January",
    proof: "/images/payment-receipt.png",
    status: "approved",
    remarks: "Payment received on time",
  },
  {
    id: 2,
    date: "2024-02-14",
    amount: 100000,
    month: "February",
    proof: "/images/payment-receipt.png",
    status: "approved",
    remarks: "Verified and approved",
  },
  {
    id: 3,
    date: "2024-03-12",
    amount: 100000,
    month: "March",
    proof: "/images/payment-receipt.png",
    status: "approved",
    remarks: "All good",
  },
  {
    id: 4,
    date: "2024-04-18",
    amount: 75000,
    month: "April",
    proof: "/images/payment-receipt.png",
    status: "pending",
    remarks: "Partial payment - awaiting remainder",
  },
  {
    id: 5,
    date: "2024-05-20",
    amount: 80000,
    month: "May",
    proof: "/images/payment-receipt.png",
    status: "pending",
    remarks: "Under review",
  },
  {
    id: 6,
    date: "2024-06-15",
    amount: 95000,
    month: "June",
    proof: "/images/payment-receipt.png",
    status: "approved",
    remarks: "Approved with minor delay",
  },
];

type ConfirmAction = {
  transactionId: number;
  action: "accept" | "reject";
  month: string;
} | null;

export function TransactionHistory({ userId }: { readonly userId: string }) {
  console.log(userId);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [transactionStatuses, setTransactionStatuses] = useState<
    Record<number, string>
  >(transactions.reduce((acc, t) => ({ ...acc, [t.id]: t.status }), {}));
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const handleAcceptProof = (transactionId: number) => {
    setTransactionStatuses((prev) => ({
      ...prev,
      [transactionId]: "approved",
    }));
    setConfirmAction(null);
    // TODO: Add API call to update transaction status
    console.log("[v0] Accepted proof for transaction:", transactionId);
  };

  const handleRejectProof = (transactionId: number) => {
    setTransactionStatuses((prev) => ({
      ...prev,
      [transactionId]: "rejected",
    }));
    setConfirmAction(null);
    // TODO: Add API call to update transaction status
    console.log("[v0] Rejected proof for transaction:", transactionId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-primary">Approved</Badge>;
      case "pending":
        return <Badge className="bg-orange-600">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed record of all payment transactions
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead className="text-right">Proof</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const currentStatus = transactionStatuses[transaction.id];

                  return (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {new Date(transaction.date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {transaction.amount.toLocaleString()}&nbsp;RWF
                      </TableCell>
                      <TableCell>{transaction.month}</TableCell>
                      <TableCell>{getStatusBadge(currentStatus)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {transaction.remarks}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProof(transaction.proof)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        {currentStatus === "pending" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  setConfirmAction({
                                    transactionId: transaction.id,
                                    action: "accept",
                                    month: transaction.month,
                                  })
                                }
                                className="gap-2 text-primary"
                              >
                                <Check className="h-4 w-4" />
                                Accept Proof
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setConfirmAction({
                                    transactionId: transaction.id,
                                    action: "reject",
                                    month: transaction.month,
                                  })
                                }
                                className="gap-2 text-red-600"
                              >
                                <X className="h-4 w-4" />
                                Reject Proof
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      <Dialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.action === "accept"
                ? "Accept Payment Proof"
                : "Reject Payment Proof"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.action === "accept"
                ? `Are you sure you want to accept the payment proof for ${confirmAction?.month}? This will mark the transaction as approved.`
                : `Are you sure you want to reject the payment proof for ${confirmAction?.month}? This will mark the transaction as rejected.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              variant={
                confirmAction?.action === "accept" ? "default" : "destructive"
              }
              onClick={() => {
                if (confirmAction) {
                  if (confirmAction.action === "accept") {
                    handleAcceptProof(confirmAction.transactionId);
                  } else {
                    handleRejectProof(confirmAction.transactionId);
                  }
                }
              }}
            >
              {confirmAction?.action === "accept" ? "Accept" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedProof}
        onOpenChange={() => setSelectedProof(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedProof && (
              <img
                src={selectedProof || "/placeholder.svg"}
                alt="Payment proof"
                className="w-full rounded-lg border"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
