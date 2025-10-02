"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import React from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  delta?: { value: string; trend: "up" | "down" | "neutral"; label?: string };
  icon?: React.ReactNode;
  variant?: "default" | "section";
  footerTitle?: string; // línea primaria inferior (p.ej., "Trending up this month")
  footerDescription?: string; // línea secundaria inferior (p.ej., "Visitors for the last 6 months")
}

export function KpiCard({ title, value, delta, icon, variant = "default", footerTitle, footerDescription }: KpiCardProps) {
  const TrendIcon = delta?.trend === "up" ? TrendingUp : delta?.trend === "down" ? TrendingDown : null;
  const colorClasses = React.useMemo(() => {
    if (!delta) return "border-muted text-muted-foreground";
    if (delta.trend === "up") {
      return "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300";
    }
    if (delta.trend === "down") {
      return "border-red-200 text-red-700 dark:border-red-800 dark:text-red-300";
    }
    return "border-muted text-muted-foreground";
  }, [delta]);

  const sectionClasses = variant === "section" ? "bg-gradient-to-t from-primary/5 to-card dark:bg-card" : "";

  return (
    <Card className={sectionClasses} data-slot="card">
      <CardHeader className="relative">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        {delta && (
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className={`flex gap-1 rounded-lg text-xs ${colorClasses}`}>
              {TrendIcon ? <TrendIcon className="size-3" /> : null}
              {delta.value}
            </Badge>
          </div>
        )}
      </CardHeader>
      {icon ? (
        <div className="absolute left-6 top-[72px] text-muted-foreground/70">
          <div className="flex h-6 w-6 items-center justify-center rounded-md border border-border bg-background/80 shadow-sm">
            {icon}
          </div>
        </div>
      ) : null}
      {(delta?.label || footerTitle || footerDescription) && (
        <CardFooter className="flex-col items-start gap-1 text-sm">
          {(delta?.label || footerTitle) && (
            <div className={`line-clamp-1 flex gap-2 font-medium ${delta?.trend === 'up' ? 'text-emerald-700 dark:text-emerald-300' : delta?.trend === 'down' ? 'text-red-700 dark:text-red-300' : 'text-foreground'}`}>
              {TrendIcon ? <TrendIcon className="w-4 h-4" /> : null}
              {footerTitle || delta?.label}
            </div>
          )}
          {footerDescription && (
            <div className="text-muted-foreground">{footerDescription}</div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}


