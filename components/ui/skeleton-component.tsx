import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SkeletonComponentProps {
  title?: string
  description?: string
  className?: string
  showTitle?: boolean
  showDescription?: boolean
  children?: React.ReactNode
  variant?: "default" | "card" | "minimal"
}

export function SkeletonComponent({
  title,
  description,
  className,
  showTitle = true,
  showDescription = true,
  children,
  variant = "default"
}: SkeletonComponentProps) {
  const baseClasses = "flex flex-col items-center justify-center py-8 px-4"
  
  const variantClasses = {
    default: "min-h-[200px]",
    card: "min-h-[300px] bg-card rounded-lg border",
    minimal: "min-h-[100px]"
  }

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {showTitle && title && (
        <Skeleton className="h-6 w-48 mb-4" />
      )}
      
      {showDescription && description && (
        <Skeleton className="h-4 w-64 mb-6" />
      )}
      
      {children || (
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <Skeleton className="h-4 w-32" />
        </div>
      )}
    </div>
  )
}

// Variantes específicas para casos comunes
export function CardSkeleton({ title, description, className }: Omit<SkeletonComponentProps, "variant">) {
  return (
    <SkeletonComponent
      title={title}
      description={description}
      variant="card"
      className={className}
    />
  )
}

export function MinimalSkeleton({ className }: { className?: string }) {
  return (
    <SkeletonComponent
      variant="minimal"
      showTitle={false}
      showDescription={false}
      className={className}
    />
  )
}

export function ListSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[160px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5, columns = 4, className }: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
