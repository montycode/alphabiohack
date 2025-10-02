import { Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

interface Step {
  id: number
  name: string
  status: "complete" | "current" | "upcoming"
}

interface BookingStepperProps {
  steps: Step[]
}

export function BookingStepper({ steps }: BookingStepperProps) {
  const progressValue = useMemo(() => {
    const currentStepIndex = steps.findIndex((step) => step.status === "current")
    const completedSteps = steps.filter((step) => step.status === "complete").length
    
    // Mostrar progreso completo si el paso actual es el 5
    return currentStepIndex === 4
      ? 100
      : ((completedSteps + (currentStepIndex >= 0 ? 0.5 : 0)) / steps.length) * 100
  }, [steps])

  return (
    <nav aria-label="Progress" className="mb-8">
      <div className="mb-6">
        <Progress value={progressValue} className="h-2" />
      </div>

      <ol className="flex items-start justify-center space-x-4 md:space-x-8">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors text-center",
                  step.status === "complete"
                    ? "bg-primary border-primary text-primary-foreground"
                    : step.status === "current"
                      ? "border-primary text-primary bg-background"
                      : "border-muted-foreground/30 text-muted-foreground bg-background",
                )}
              >
                {step.status === "complete" || (step.id === 4 && step.status === "current") ? <Check className="h-5 w-5" /> : step.id + 1}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center",
                  step.status === "current"
                    ? "text-primary"
                    : step.status === "complete"
                      ? "text-foreground"
                      : "text-muted-foreground",
                )}
              >
                {step.name}
              </span>
            </div>
            {stepIdx < steps.length - 1 && <div className="hidden md:block w-16 h-0.5 bg-border ml-4" />}
          </li>
        ))}
      </ol>
    </nav>
  )
}
