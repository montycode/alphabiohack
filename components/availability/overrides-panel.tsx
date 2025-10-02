"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React, { useMemo, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";

import { API_ENDPOINTS } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppToast } from "@/hooks/use-app-toast";
import { useOverrides } from "@/hooks/use-overrides";

type Props = {
  locationId: string;
};

export function OverridesPanel({ locationId }: Props) {
  const t = useTranslations("Availability");
  const tErrors = useTranslations("ApiErrors");
  const formatter = useFormatter();
  const toast = useAppToast();

  const today = useMemo(() => new Date(), []);
  const in30 = useMemo(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), []);
  const { overrides, loading, error, refetch } = useOverrides(
    locationId,
    today.toISOString(),
    in30.toISOString()
  );

  const [isClosed, setIsClosed] = useState(true);
  const [createRange, setCreateRange] = useState<DateRange | undefined>(undefined);
  const [reason, setReason] = useState("");
  const [newSlotStart, setNewSlotStart] = useState("09:00");
  const [newSlotEnd, setNewSlotEnd] = useState("17:00");
  const [draftSlots, setDraftSlots] = useState<{ startTime: string; endTime: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [slotSaving, setSlotSaving] = useState<Record<string, boolean>>({});
  const [addSlotInputs, setAddSlotInputs] = useState<Record<string, { start: string; end: string }>>({});

  // Estados para edición de overrides existentes
  const [editStart, setEditStart] = useState<Record<string, Date | undefined>>({});
  const [editEnd, setEditEnd] = useState<Record<string, Date | undefined>>({});
  const [editRange, setEditRange] = useState<Record<string, DateRange | undefined>>({});
  const [editOpenRange, setEditOpenRange] = useState<Record<string, boolean>>({});
  const [editIsClosed, setEditIsClosed] = useState<Record<string, boolean>>({});
  const [editReason, setEditReason] = useState<Record<string, string>>({});
  const [editSaving, setEditSaving] = useState<Record<string, boolean>>({});

  const isCreateInvalid = !createRange?.from || !createRange?.to || (!isClosed && draftSlots.length === 0);

  const handleCreate = async () => {
    if (isCreateInvalid) return;
    setSaving(true);
    try {
      const payload: {
        locationId: string;
        startDate: string | undefined;
        endDate: string | undefined;
        isClosed: boolean;
        reason?: string;
        timeSlots?: Array<{ startTime: string; endTime: string; isActive: boolean }>;
      } = {
        locationId,
        startDate: createRange?.from?.toISOString(),
        endDate: createRange?.to?.toISOString(),
        isClosed,
        reason: reason || undefined,
      };
      if (!isClosed && draftSlots.length > 0) {
        payload.timeSlots = draftSlots.map((s) => ({ ...s, isActive: true }));
      }
      const res = await fetch(API_ENDPOINTS.OVERRIDES.BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const code = json?.error || json?.errorCode;
        if (code) toast.error(tErrors(code)); else toast.error(tErrors("internal_error"));
      } else {
        toast.success(t("overrides.create"));
        await refetch();
        setReason("");
        setCreateRange(undefined);
        setDraftSlots([]);
      }
    } finally {
      setSaving(false);
    }
  };

  const addDraftSlot = () => {
    if (!newSlotStart || !newSlotEnd) return;
    if (newSlotStart >= newSlotEnd) return;
    setDraftSlots((prev) => [...prev, { startTime: newSlotStart, endTime: newSlotEnd }]);
  };

  const removeDraftSlot = (index: number) => {
    setDraftSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const setOverrideInput = (id: string, key: "start" | "end", value: string) => {
    setAddSlotInputs((prev) => ({
      ...prev,
      [id]: { start: prev[id]?.start ?? "09:00", end: prev[id]?.end ?? "17:00", [key]: value },
    }));
  };

  const createOverrideSlot = async (overrideId: string) => {
    const inputs = addSlotInputs[overrideId] || { start: "09:00", end: "17:00" };
    if (!inputs.start || !inputs.end || inputs.start >= inputs.end) return;
    setSlotSaving((prev) => ({ ...prev, [overrideId]: true }));
    try {
      const res = await fetch(API_ENDPOINTS.OVERRIDES.SLOTS.BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateOverrideId: overrideId, startTime: inputs.start, endTime: inputs.end, isActive: true }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const code = json?.error || json?.errorCode;
        if (code) toast.error(tErrors(code)); else toast.error(tErrors("internal_error"));
      } else {
        toast.success(t("overrides.addSlot"));
        await refetch();
        setAddSlotInputs((prev) => ({ ...prev, [overrideId]: { start: "09:00", end: "17:00" } }));
      }
    } finally {
      setSlotSaving((prev) => ({ ...prev, [overrideId]: false }));
    }
  };

  const deleteOverrideSlot = async (slotId: string) => {
    const res = await fetch(API_ENDPOINTS.OVERRIDES.SLOTS.BY_ID(slotId), { method: "DELETE" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const code = json?.error || json?.errorCode;
      if (code) toast.error(tErrors(code)); else toast.error(tErrors("internal_error"));
    } else {
      toast.success(t("overrides.delete"));
      await refetch();
    }
  };

  const saveOverride = async (
    id: string,
    original: {
      startDate: string | Date;
      endDate: string | Date;
      isClosed: boolean;
      reason?: string | null;
    }
  ) => {
    setEditSaving((p) => ({ ...p, [id]: true }));
    try {
      const body: {
        startDate?: string;
        endDate?: string;
        isClosed: boolean;
        reason?: string;
      } = {
        startDate: (editStart[id] ?? new Date(original.startDate))?.toISOString(),
        endDate: (editEnd[id] ?? new Date(original.endDate))?.toISOString(),
        isClosed: editIsClosed[id] ?? original.isClosed,
        reason: (editReason[id] ?? original.reason) || undefined,
      };
      const res = await fetch(API_ENDPOINTS.OVERRIDES.BY_ID(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const code = json?.error || json?.errorCode;
        if (code) toast.error(tErrors(code)); else toast.error(tErrors("internal_error"));
      } else {
        toast.success(t("overrides.save"));
        await refetch();
      }
    } finally {
      setEditSaving((p) => ({ ...p, [id]: false }));
    }
  };

  const deleteOverride = async (id: string) => {
    setEditSaving((p) => ({ ...p, [id]: true }));
    try {
      const res = await fetch(API_ENDPOINTS.OVERRIDES.BY_ID(id), { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const code = json?.error || json?.errorCode;
        if (code) toast.error(tErrors(code)); else toast.error(tErrors("internal_error"));
      } else {
        toast.success(t("overrides.delete"));
        await refetch();
      }
    } finally {
      setEditSaving((p) => ({ ...p, [id]: false }));
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">{t("overrides.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-4">
            <Label>{t("overrides.rangeStart")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" id="override-range" className="w-full justify-between font-normal">
                  {createRange?.from && createRange?.to
                    ? `${formatter.dateTime(createRange.from, { dateStyle: 'medium' })} – ${formatter.dateTime(createRange.to, { dateStyle: 'medium' })}`
                    : "Select date"}
                  <ChevronDownIcon className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="range"
                  selected={createRange}
                  captionLayout="dropdown"
                  onSelect={(range) => setCreateRange(range)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={isClosed} onCheckedChange={setIsClosed} />
          <span className="text-sm">{t("overrides.closed")}</span>
        </div>
        {!isClosed && (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">{t("overrides.selectTimeRange") || ""}</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-4">
                <Label>{t("overrides.slotStart")}</Label>
                <Input type="time" value={newSlotStart} onChange={(e) => setNewSlotStart(e.target.value)} />
              </div>
              <div className="space-y-4">
                <Label>{t("overrides.slotEnd")}</Label>
                <Input type="time" value={newSlotEnd} onChange={(e) => setNewSlotEnd(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={addDraftSlot}>{t("overrides.addSlot")}</Button>
            </div>
            {draftSlots.length > 0 && (
              <div className="space-y-2">
                {draftSlots.map((s, idx) => (
                  <div key={`${s.startTime}-${s.endTime}-${idx}`} className="flex items-center justify-between bg-muted/50 rounded-md p-2">
                    <div className="text-sm">Inicio: {s.startTime} — Fin: {s.endTime}</div>
                    <Button variant="destructive" size="sm" onClick={() => removeDraftSlot(idx)}>{t("overrides.delete")}</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex justify-end">
          <Button onClick={handleCreate} disabled={isCreateInvalid || saving}>{saving ? t("overrides.saving") : t("overrides.create")}</Button>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm">{t("overrides.upcoming")}</h4>
            {loading && <Badge variant="secondary">{t("overrides.saving")}</Badge>}
          </div>
          {error && (
            <div className="text-sm text-red-600">{t("overrides.error")}</div>
          )}
          <div className="space-y-3">
            {overrides.map((o) => (
              <div key={o.id} className="p-3 bg-muted rounded-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-medium">
                      {new Date(o.startDate).toLocaleDateString()} — {new Date(o.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs opacity-80">
                      {o.isClosed ? t("overrides.closed") : t("overrides.definedSlots", { count: o.timeSlots?.length || 0 })}
                    </div>
                  </div>
                  {o.reason && <Badge variant="outline">{o.reason}</Badge>}
                </div>

                {/* Editor inline */}
                <div className="space-y-4">
                  <Label>{t("overrides.rangeStart")}</Label>
                  <Popover open={!!editOpenRange[o.id!]} onOpenChange={(open) => setEditOpenRange((p) => ({ ...p, [o.id!]: open }))}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between font-normal">
                        {(() => {
                          const current = editRange[o.id!] ?? { from: new Date(o.startDate), to: new Date(o.endDate) };
                          return current?.from && current?.to
                            ? `${formatter.dateTime(current.from, { dateStyle: 'medium' })} – ${formatter.dateTime(current.to, { dateStyle: 'medium' })}`
                            : "Select date";
                        })()}
                        <ChevronDownIcon className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="range"
                        captionLayout="dropdown"
                        selected={editRange[o.id!] ?? { from: new Date(o.startDate), to: new Date(o.endDate) }}
                        onSelect={(range) => {
                          setEditRange((p) => ({ ...p, [o.id!]: range }));
                          const from = range?.from ?? new Date(o.startDate);
                          const to = range?.to ?? new Date(o.endDate);
                          setEditStart((p) => ({ ...p, [o.id!]: from }));
                          setEditEnd((p) => ({ ...p, [o.id!]: to }));
                          setEditOpenRange((p) => ({ ...p, [o.id!]: false }));
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 space-y-4">
                    <Switch
                      checked={editIsClosed[o.id!] ?? o.isClosed}
                      onCheckedChange={(val) => setEditIsClosed((p) => ({ ...p, [o.id!]: val }))}
                    />
                    <span className="text-sm">{t("overrides.closed")}</span>
                  </div>
                  <div className="space-y-4">
                    <Label>{t("overrides.reason")}</Label>
                    <Input
                      value={editReason[o.id!] ?? o.reason ?? ""}
                      onChange={(e) => setEditReason((p) => ({ ...p, [o.id!]: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="destructive" className="cursor-pointer" onClick={() => deleteOverride(o.id!)} disabled={!!editSaving[o.id!]}>{t("overrides.delete")}</Button>
                  <Button className="cursor-pointer" onClick={() => saveOverride(o.id!, o)} disabled={!!editSaving[o.id!]}>{editSaving[o.id!] ? t("overrides.saving") : t("overrides.save")}</Button>
                </div>

                {!o.isClosed && (
                  <div className="space-y-2">
                    {(o.timeSlots || []).map((s) => (
                      <div key={s.id} className="flex items-center justify-between bg-background/60 rounded border p-2">
                        <div className="text-sm">Inicio: {s.startTime} — Fin: {s.endTime}</div>
                        <Button variant="destructive" size="sm" className="cursor-pointer" onClick={() => s.id && deleteOverrideSlot(s.id)}>{t("overrides.delete")}</Button>
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-4">
                        <Label>{t("overrides.slotStart")}</Label>
                        <Input
                          type="time"
                          value={addSlotInputs[o.id!]?.start ?? "09:00"}
                          onChange={(e) => setOverrideInput(o.id!, "start", e.target.value)}
                        />
                      </div>
                      <div className="space-y-4">
                        <Label>{t("overrides.slotEnd")}</Label>
                        <Input
                          type="time"
                          value={addSlotInputs[o.id!]?.end ?? "17:00"}
                          onChange={(e) => setOverrideInput(o.id!, "end", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button size="sm" variant="default" className="cursor-pointer" disabled={slotSaving[o.id!]} onClick={() => createOverrideSlot(o.id!)}>
                        {slotSaving[o.id!] ? t("overrides.adding") : t("overrides.addSlot")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {!overrides.length && !loading && (
              <div className="text-sm opacity-70">{t("overrides.none")}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


