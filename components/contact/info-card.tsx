"use client";

import { Card } from "@/components/ui/card";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function InfoCard({ icon, title, children, className }: InfoCardProps) {
  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow bg-card text-card-foreground ${className || ''}`}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold mb-1 text-foreground">{title}</h3>
          <div className="text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}


