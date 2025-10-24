import { Card, CardContent } from "@/components/ui/card";
import { Mail, CheckCircle, Clock, XCircle } from "lucide-react";

const stats = [
  {
    title: "Total Invites",
    value: "156",
    icon: Mail,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Accepted",
    value: "98",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Pending",
    value: "42",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Declined",
    value: "16",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
];

export function InvitesSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="shadow-none">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon className={`h-5 w-5`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
