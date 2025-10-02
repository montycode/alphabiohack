"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface WeeklyOverviewProps {
  title?: string;
  subtitle?: string;
  data: Array<{ day: string; value: number }>;
  seriesKey?: string; // nombre de la serie, ej: "appointments"
  label?: string; // etiqueta para la leyenda/tooltip
}

export function WeeklyOverview({
  title = "Weekly Overview",
  subtitle,
  data,
  seriesKey = "appointments",
  label = "Appointments",
}: WeeklyOverviewProps) {
  const chartConfig = {
    [seriesKey]: {
      label,
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const mappedData = data.map((d) => ({ day: d.day, [seriesKey!]: d.value })) as Array<Record<string, unknown>>;

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={mappedData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} tickMargin={8} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey={seriesKey} fill={`var(--color-${seriesKey})`} radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


