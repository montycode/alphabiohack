"use client";

interface AppointmentItem {
  id: string;
  date: string; // ISO
  time: string; // HH:mm
  name: string; // patient or therapist
  service?: string;
  location?: string;
}

interface NextAppointmentsListProps {
  role: "therapist" | "patient";
  items: AppointmentItem[];
  emptyLabel: string;
}

export function NextAppointmentsList({ role, items, emptyLabel }: NextAppointmentsListProps) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="text-card-foreground">
      <div className="max-h-[650px] overflow-y-auto">
        <ul>
          {items.map((a, idx) => {
            const dateObj = new Date(`${a.date}T${a.time}:00`);
            const dateLabel = dateObj.toLocaleString(undefined, {
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
              month: "short",
              day: "2-digit",
            });
            return (
              <li key={a.id} className="p-4 hover:bg-muted/30 transition-colors">
                <time className="block text-xs font-medium text-primary" dateTime={dateObj.toISOString()}>
                  {dateLabel}
                </time>
                <h4 className="mt-1 text-base font-semibold">
                  {role === "therapist" ? a.name : a.service || a.name}
                </h4>
                {a.location && <p className="text-sm text-muted-foreground">{a.location}</p>}
                {idx < items.length - 1 && <div className="mt-4 h-px bg-border" />}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}


