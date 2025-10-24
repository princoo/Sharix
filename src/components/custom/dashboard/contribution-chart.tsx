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
} from "recharts";

const chartData = [
  { month: "Jan", amount: 8500 },
  { month: "Feb", amount: 9200 },
  { month: "Mar", amount: 10100 },
  { month: "Apr", amount: 9800 },
  { month: "May", amount: 11200 },
  { month: "Jun", amount: 10800 },
  { month: "Jul", amount: 12500 },
  { month: "Aug", amount: 11900 },
  { month: "Sep", amount: 13200 },
  { month: "Oct", amount: 12800 },
  { month: "Nov", amount: 14100 },
  { month: "Dec", amount: 15300 },
];

export function ContributionChart() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg text-primary">
          Contribution Trends
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Monthly contribution amounts over the past year
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
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--primary))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number) => [
                `RWF ${value.toLocaleString()}`,
                "Amount",
              ]}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
