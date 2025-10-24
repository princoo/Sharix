"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Dummy data - replace with real data later
const getUserData = (userId: string) => ({
  id: userId,
  name: "Uwase Aline",
  email: "uwase.aline@example.com",
  status: "active",
  dateJoined: "2024-02-20",
  totalContributions: 850000,
  expectedTotal: 1200000,
  remainingBalance: 350000,
  paymentCompletion: 70.8,
});

export function UserSummaryHeader({ userId }: { readonly userId: string }) {
  const user = getUserData(userId);

  return (
    <div className="space-y-4 mb-10">
      <div className="shadow-none">
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-primary">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Joined{" "}
                  {new Date(user.dateJoined).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <Badge
                  className={`${user.status === "active" ? "bg-cyan-100 text-primary" : "bg-red-100 text-red-800"}`}
                >
                  {user.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                {user.status === "active" ? (
                  <Button variant="destructive" size="sm" className="gap-2">
                    Deactivate User
                  </Button>
                ) : (
                  <Button variant="default" size="sm" className="gap-2">
                    Reactivate User
                  </Button>
                )}
              </div>
            </div>

            {/* Financial Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-none">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Contributions
                    </p>
                    <p className="text-2xl font-bold">
                      RWF {user.totalContributions.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-none">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Expected Total
                    </p>
                    <p className="text-2xl font-bold">
                      RWF {user.expectedTotal.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-none">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Remaining Balance
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      RWF {user.remainingBalance.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-none">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Payment Completion
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {user.paymentCompletion}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Overall Payment Progress</span>
                <span className="text-muted-foreground">
                  {user.paymentCompletion}%
                </span>
              </div>
              <Progress value={user.paymentCompletion} className="h-3" />
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
