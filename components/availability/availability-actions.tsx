import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface AvailabilityActionsProps {
  hasChanges: boolean;
  isSaving: boolean;
  onCancel?: () => void;
  onSave: () => void;
}

export function AvailabilityActions({
  hasChanges,
  isSaving,
  onCancel,
  onSave,
}: AvailabilityActionsProps) {
  const t = useTranslations("Availability");

  return (
    <div className="flex justify-end gap-3 pt-4">
      {onCancel && (
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          {t("cancel")}
        </Button>
      )}
      <Button
        onClick={onSave}
        disabled={!hasChanges || isSaving}
        className={hasChanges ? "bg-gradient-accent" : "bg-muted"}
      >
        {isSaving ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {t("loading")}
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            {t("saveChanges")}
          </>
        )}
      </Button>
    </div>
  );
}
