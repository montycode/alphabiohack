"use client";

interface Action {
  id: string;
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline";
}

interface QuickActionsProps {
  title: string;
  actions: Action[];
}

export function QuickActions({ title, actions }: QuickActionsProps) {
  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground p-4">
      <div className="text-sm font-medium mb-3">{title}</div>
      <div className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <button
            key={a.id}
            onClick={a.onClick}
            className={
              a.variant === "outline"
                ? "px-3 py-1.5 rounded-md border border-border text-foreground hover:bg-muted"
                : "px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            }
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}


