"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssessmentResult } from "@/generated/prisma";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
} from "recharts";

type ChartDataType = {
  date: string;
  score: number;
};

const PerformanceChart = ({
  assessments,
}: {
  assessments: AssessmentResult[];
}) => {
  const [chartData, setChartData] = useState<ChartDataType[]>([]);

  useEffect(() => {
    if (assessments) {
      const data = assessments.map((assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: assessment.score,
      }));
      setChartData(data);
    }
  }, [assessments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-title text-3xl md:text-4xl">
          Performance Trend
        </CardTitle>
        <CardDescription>Your assessment scores over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div className="bg-background border rounded-lg p-2 shadow-md">
                      <p className="text-sm font-medium">
                        Score: {payload[0].value}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payload[0].payload.date}
                      </p>
                    </div>
                  ) : null
                }
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="white"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
