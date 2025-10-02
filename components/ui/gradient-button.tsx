import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "horizontal" | "vertical" | "diagonal"
  children: React.ReactNode
}

export function GradientButton({ 
  variant = "default", 
  className, 
  children, 
  ...props 
}: GradientButtonProps) {
  const gradientClasses = {
    default: "bg-gradient-accent",
    horizontal: "bg-gradient-accent-horizontal", 
    vertical: "bg-gradient-accent-vertical",
    diagonal: "bg-gradient-accent-diagonal"
  }

  return (
    <Button
      className={cn(
        gradientClasses[variant],
        "text-white border-0 hover:opacity-90 transition-opacity",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
