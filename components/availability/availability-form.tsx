"use client";

import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AsyncWrapper } from "@/components/ui/async-wrapper";
import { AvailabilityActions } from "./availability-actions";
import { AvailabilityError } from "./availability-error";
import type { AvailabilityFormData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { DayScheduleComponent } from "./day-schedule";
import { OverridesPanel } from "./overrides-panel";
import React from "react";
import { useAvailabilityContext } from "@/contexts/availability-context";
import { useTranslations } from "next-intl";

interface AvailabilityFormProps {
  locationId: string;
  locationName: string;
  onSave?: (data: AvailabilityFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function AvailabilityForm({
  locationId,
  locationName,
  onCancel,
}: AvailabilityFormProps) {
  const t = useTranslations("Availability");

  const {
    days,
    hasChanges,
    isSaving,
    deletingSlots,
    loading: fetchLoading,
    operationsLoading,
    error,
    handleToggleDay,
    handleAddTimeSlot,
    handleRemoveTimeSlot,
    handleTimeSlotChange,
    handleSave,
  } = useAvailabilityContext();

  const onSaveHandler = () => {
    handleSave();
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <AsyncWrapper
      loading={fetchLoading}
      error={error}
      data={days}
      skeletonProps={{
        title: t("locationSchedule", { locationName }),
        description: t("loadingAvailability"),
        variant: "card"
      }}
      errorProps={{
        title: t("errorLoadingAvailability"),
        description: t("errorLoadingAvailabilityDescription"),
        onRetry: handleRetry,
        variant: "card"
      }}
    >
    <div className="w-full max-w-full overflow-hidden">
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="pb-4 px-4 sm:px-6">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                {t("locationSchedule", { locationName })}
              </span>
            </div>
            {hasChanges && (
              <Badge 
                variant="secondary" 
                className="self-start sm:self-center bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800"
              >
                <Clock className="h-3 w-3 mr-1" />
                {t("unsavedChanges")}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6 space-y-4 sm:space-y-6">
          {error && <AvailabilityError error={error} />}

          <Tabs defaultValue="hours" className="w-full">
            <TabsList className="mb-2">
              <TabsTrigger value="hours">{t("tabs.hours")}</TabsTrigger>
              <TabsTrigger value="overrides">{t("tabs.overrides")}</TabsTrigger>
            </TabsList>

            <TabsContent value="hours">
              {/* Days Grid - Responsive */}
              <div className="space-y-3 sm:space-y-4">
                {days.map((day) => (
                  <div key={day.dayOfWeek} className="w-full">
                    <DayScheduleComponent
                      day={day}
                      onToggleDay={handleToggleDay}
                      onAddTimeSlot={handleAddTimeSlot}
                      onRemoveTimeSlot={handleRemoveTimeSlot}
                      onTimeSlotChange={handleTimeSlotChange}
                      operationsLoading={operationsLoading}
                      deletingSlots={deletingSlots}
                    />
                  </div>
                ))}
              </div>

              {/* Actions - Mobile Optimized */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <AvailabilityActions
                  hasChanges={hasChanges}
                  isSaving={isSaving}
                  onCancel={onCancel}
                  onSave={onSaveHandler}
                />
              </div>
            </TabsContent>

            <TabsContent value="overrides">
              <OverridesPanel locationId={locationId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    </AsyncWrapper>
  );
}
