"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, UserX, UserCheck } from "lucide-react";

export function UserActions({ userId }: { readonly userId: string }) {
  // eslint-disable-next-line no-console
  console.log(userId);
  return (
    <Card className="shadow-none">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-3">
          <Button className="gap-2">
            <Bell className="h-4 w-4" />
            Remind User
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <CheckCheck className="h-4 w-4" />
            Approve All Pending Payments
          </Button>
          <Button variant="destructive" className="gap-2">
            <UserX className="h-4 w-4" />
            Deactivate User
          </Button>
          <Button variant="secondary" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Reactivate User
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
