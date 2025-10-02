interface AvailabilityErrorProps {
  error: string;
}

export function AvailabilityError({ error }: AvailabilityErrorProps) {
  return (
    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
      <p className="text-sm text-destructive">{error}</p>
    </div>
  );
}
