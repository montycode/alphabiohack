import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

export function AvailabilityLoadingSkeleton() {
  const t = useTranslations("Availability");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {t("loading")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
