import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Mail, Clock, Users } from "lucide-react";

const summaryData = [
  {
    title: "Total Contributions",
    value: "RWF 120,000",
    icon: DollarSign,
    description: "+12% from last month",
  },
  {
    title: "Total Invites Sent",
    value: "35",
    icon: Mail,
    description: "8 sent this week",
  },
  {
    title: "Pending Invites",
    value: "7",
    icon: Clock,
    description: "Awaiting response",
  },
  {
    title: "Registered Users",
    value: "120",
    icon: Users,
    description: "+5 new this week",
  },
];

export function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
