"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Dummy data - replace with real data later
const chartData = [
  { month: "Jan", expected: 100000, paid: 100000 },
  { month: "Feb", expected: 100000, paid: 100000 },
  { month: "Mar", expected: 100000, paid: 100000 },
  { month: "Apr", expected: 100000, paid: 75000 },
  { month: "May", expected: 100000, paid: 80000 },
  { month: "Jun", expected: 100000, paid: 95000 },
  { month: "Jul", expected: 100000, paid: 100000 },
  { month: "Aug", expected: 100000, paid: 100000 },
  { month: "Sep", expected: 100000, paid: 100000 },
  { month: "Oct", expected: 100000, paid: 0 },
  { month: "Nov", expected: 100000, paid: 0 },
  { month: "Dec", expected: 100000, paid: 0 },
];

export function ContributionTrendChart({
  userId,
}: {
  readonly userId: string;
}) {
  // eslint-disable-next-line no-console
  console.log(userId);
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg text-primary">
          Contribution Trend
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Monthly contribution comparison: expected vs. paid
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [
                `RWF ${value.toLocaleString()}`,
                "",
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="expected"
              stroke="var(--muted-foreground)"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Expected"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="paid"
              stroke="var(--primary)"
              strokeWidth={2}
              name="Paid"
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
