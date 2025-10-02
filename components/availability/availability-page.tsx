"use client";

import { AlertCircle, Calendar, Clock, MapPin, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { AsyncWrapper } from "@/components/ui/async-wrapper";
import { AvailabilityForm } from "./availability-form";
import type { AvailabilityFormData } from "@/types";
import { AvailabilityProvider } from "@/contexts/availability-context";
import { Button } from "@/components/ui/button";
import { useAppToast } from "@/hooks/use-app-toast";
import { useAvailabilityOperations } from "@/hooks";
import { useLocations } from "@/hooks";
import { useTranslations } from "next-intl";

export function AvailabilityPage() {
  const t = useTranslations("Availability");
  const { locations, loading: locationsLoading, error: locationsError } = useLocations();
  const { updateLocationAvailability, loading: operationsLoading, error: operationsError } = useAvailabilityOperations();
  const toast = useAppToast();
  const tReq = useTranslations("Requests");
  const tErrors = useTranslations("ApiErrors");
  const tCommon = useTranslations("Common");
  
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);

  const handleLocationChange = (locationId: string) => {
    setSelectedLocationId(locationId);
  };

  const handleSaveAvailability = async (data: AvailabilityFormData) => {
    setIsSaving(true);
    try {
      const promise = updateLocationAvailability(data);
      toast.promise(promise, {
        loading: tCommon("loading"),
        success: () => tReq("availability.update.success"),
        error: (err) => {
          const code = (err as { errorCode?: string })?.errorCode || (typeof err === "string" ? err : undefined);
          return code ? tErrors(code) : tReq("availability.update.error");
        },
      });
      await promise;
    } catch (error) {
      console.error("Error saving availability:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedLocationId("");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <AsyncWrapper
      loading={locationsLoading}
      error={locationsError}
      data={locations}
      skeletonProps={{
        title: t("title"),
        description: t("description"),
        variant: "default"
      }}
      errorProps={{
        title: t("errorTitle"),
        description: t("errorLoadingLocations"),
        onRetry: handleRetry,
        variant: "card"
      }}
    >
      <div className="min-h-screen p-2 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">

        {/* Location Selection Card */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {t("selectLocation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Select value={selectedLocationId} onValueChange={handleLocationChange}>
                <SelectTrigger className="w-full h-12 text-base border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                  <SelectValue placeholder={t("noLocationSelected")} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <span className="truncate">{location.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedLocation && (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {t("locationSchedule", { locationName: selectedLocation.title })}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {selectedLocation.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Availability Form or Empty State */}
        {selectedLocationId && selectedLocation ? (
          <AvailabilityProvider key={selectedLocationId} locationId={selectedLocationId}>
            <AvailabilityForm
              locationId={selectedLocationId}
              locationName={selectedLocation.title}
              onSave={handleSaveAvailability}
              onCancel={handleCancel}
              loading={isSaving || operationsLoading}
            />
          </AvailabilityProvider>
        ) : (
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-2 md:p-6">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-lg opacity-20"></div>
                  <Clock className="h-16 w-16 text-blue-600 dark:text-blue-400 relative z-10" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {t("noLocationSelected")}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md">
                    {t("selectLocationDescription")}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-800 dark:hover:border-blue-700 dark:hover:bg-blue-900/20"
                  onClick={() => setSelectedLocationId(locations[0]?.id || "")}
                  disabled={locations.length === 0}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {t("startManaging")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {operationsError && (
          <Card className="shadow-lg border-0 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border-red-200 dark:border-red-800">
            <CardContent className="p-2 md:p-6">
              <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm sm:text-base">{t("errorTitle")}</p>
                  <p className="text-xs sm:text-sm mt-1">{operationsError}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </AsyncWrapper>
  );
}
