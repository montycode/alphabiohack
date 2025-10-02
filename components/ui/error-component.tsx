import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Home, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorComponentProps {
  title?: string
  description?: string
  error?: string | Error
  onRetry?: () => void
  onGoHome?: () => void
  onGoBack?: () => void
  className?: string
  variant?: "default" | "card" | "alert" | "minimal"
  showIcon?: boolean
  showActions?: boolean
  retryText?: string
  homeText?: string
  backText?: string
}

export function ErrorComponent({
  title = "Algo salió mal",
  description = "Ha ocurrido un error inesperado. Por favor, intenta nuevamente.",
  error,
  onRetry,
  onGoHome,
  onGoBack,
  className,
  variant = "default",
  showIcon = true,
  showActions = true,
  retryText = "Reintentar",
  homeText = "Ir al inicio",
  backText = "Volver"
}: ErrorComponentProps) {
  const errorMessage = error instanceof Error ? error.message : error

  const renderContent = () => (
    <div className="flex flex-col items-center text-center space-y-4">
      {showIcon && (
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
        {errorMessage && (
          <p className="text-xs text-red-600 dark:text-red-400 font-mono bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {errorMessage}
          </p>
        )}
      </div>

      {showActions && (
        <div className="flex flex-col sm:flex-row gap-2">
          {onRetry && (
            <Button onClick={onRetry} variant="default" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              {retryText}
            </Button>
          )}
          {onGoBack && (
            <Button onClick={onGoBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backText}
            </Button>
          )}
          {onGoHome && (
            <Button onClick={onGoHome} variant="outline" size="sm">
              <Home className="w-4 h-4 mr-2" />
              {homeText}
            </Button>
          )}
        </div>
      )}
    </div>
  )

  if (variant === "card") {
    return (
      <Card className={cn("border-red-200 dark:border-red-800", className)}>
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    )
  }

  if (variant === "alert") {
    return (
      <Alert variant="destructive" className={cn("max-w-md mx-auto", className)}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold">{title}</p>
            <p>{description}</p>
            {errorMessage && (
              <p className="text-xs font-mono">{errorMessage}</p>
            )}
            {showActions && onRetry && (
              <Button onClick={onRetry} variant="outline" size="sm" className="mt-2">
                <RefreshCw className="w-4 h-4 mr-2" />
                {retryText}
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (variant === "minimal") {
    return (
      <div className={cn("text-center py-4", className)}>
        <p className="text-sm text-red-600 dark:text-red-400">{title}</p>
        {errorMessage && (
          <p className="text-xs text-red-500 dark:text-red-500 mt-1">{errorMessage}</p>
        )}
        {showActions && onRetry && (
          <Button onClick={onRetry} variant="ghost" size="sm" className="mt-2">
            <RefreshCw className="w-4 h-4 mr-1" />
            {retryText}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-8 px-4 min-h-[200px]", className)}>
      {renderContent()}
    </div>
  )
}

// Variantes específicas para casos comunes
export function CardError({ 
  title, 
  description, 
  error, 
  onRetry, 
  className 
}: Omit<ErrorComponentProps, "variant">) {
  return (
    <ErrorComponent
      title={title}
      description={description}
      error={error}
      onRetry={onRetry}
      variant="card"
      className={className}
    />
  )
}

export function AlertError({ 
  description, 
  error, 
  onRetry, 
  className 
}: Omit<ErrorComponentProps, "variant" | "title">) {
  return (
    <ErrorComponent
      description={description}
      error={error}
      onRetry={onRetry}
      variant="alert"
      className={className}
    />
  )
}

export function MinimalError({ 
  description, 
  error, 
  onRetry, 
  className 
}: Omit<ErrorComponentProps, "variant" | "title" | "showIcon">) {
  return (
    <ErrorComponent
      description={description}
      error={error}
      onRetry={onRetry}
      variant="minimal"
      showIcon={false}
      className={className}
    />
  )
}
