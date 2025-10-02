import { ErrorComponent } from "@/components/ui/error-component"
import { ReactNode } from "react"
import { SkeletonComponent } from "@/components/ui/skeleton-component"

interface AsyncWrapperProps {
  loading: boolean
  error: string | null
  data: unknown
  children: ReactNode
  skeletonProps?: {
    title?: string
    description?: string
    variant?: "default" | "card" | "minimal"
    className?: string
  }
  errorProps?: {
    title?: string
    description?: string
    onRetry?: () => void
    variant?: "default" | "card" | "alert" | "minimal"
    className?: string
  }
  fallback?: ReactNode
  showSkeletonOnError?: boolean
}

export function AsyncWrapper({
  loading,
  error,
  data,
  children,
  skeletonProps = {},
  errorProps = {},
  fallback,
  showSkeletonOnError = false
}: AsyncWrapperProps) {
  // Si hay error y no queremos mostrar skeleton, mostrar error
  if (error && !showSkeletonOnError) {
    return (
      <ErrorComponent
        title={errorProps.title}
        description={errorProps.description}
        error={error}
        onRetry={errorProps.onRetry}
        variant={errorProps.variant}
        className={errorProps.className}
      />
    )
  }

  // Si está cargando, mostrar skeleton
  if (loading) {
    return (
      <SkeletonComponent
        title={skeletonProps.title}
        description={skeletonProps.description}
        variant={skeletonProps.variant}
        className={skeletonProps.className}
      />
    )
  }

  // Si hay error pero queremos mostrar skeleton, mostrar skeleton
  if (error && showSkeletonOnError) {
    return (
      <SkeletonComponent
        title={skeletonProps.title}
        description={skeletonProps.description}
        variant={skeletonProps.variant}
        className={skeletonProps.className}
      />
    )
  }

  // Si no hay datos y no está cargando, mostrar fallback o children vacío
  if (!data && !loading && !error) {
    return fallback || <div>{children}</div>
  }

  // Si hay datos, mostrar children
  return <div>{children}</div>
}
