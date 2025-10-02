"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useUser } from "@/contexts/user-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: "/auth/login" | "/" | "/dashboard" | "/profile" | "/appointments" | "/contact" | "/booking" | "/auth/sign-up" | "/auth/sign-up-success" | "/auth/forgot-password" | "/auth/update-password" | "/auth/error" | "/auth/confirm";
}

export function ProtectedRoute({ 
  children, 
  redirectTo = "/auth/login" 
}: ProtectedRouteProps) {
  const { loading, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [loading, isAuthenticated, router, redirectTo]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (el redirect ya se ejecutó)
  if (!isAuthenticated) {
    return null;
  }

  // Si está autenticado, renderizar el contenido
  return <>{children}</>;
}
