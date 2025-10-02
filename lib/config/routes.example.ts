/**
 * Ejemplo de uso de las configuraciones de rutas
 *
 * Este archivo muestra cómo usar las funciones de configuración de rutas
 * en diferentes partes de la aplicación.
 */

import {
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
  isProtectedRoute,
  isPublicRoute,
  shouldProcessRoute,
} from "@/lib/config/routes";

// Ejemplo de uso en un componente
export function ExampleComponent() {
  const currentPath = "/dashboard";

  // Verificar si la ruta actual es pública
  if (isPublicRoute(currentPath)) {
    console.log("Esta es una ruta pública");
  }

  // Verificar si la ruta actual es protegida
  if (isProtectedRoute(currentPath)) {
    console.log("Esta es una ruta protegida");
  }

  // Verificar si el middleware debe procesar esta ruta
  if (shouldProcessRoute(currentPath)) {
    console.log("El middleware procesará esta ruta");
  }
}

// Ejemplo de uso en un hook personalizado
export function useRouteProtection() {
  const checkAccess = (pathname: string) => {
    if (isPublicRoute(pathname)) {
      return { allowed: true, redirectTo: null };
    }

    if (isProtectedRoute(pathname)) {
      return { allowed: false, redirectTo: "/auth/login" };
    }

    return { allowed: true, redirectTo: null };
  };

  return { checkAccess };
}

// Ejemplo de uso en un componente de navegación
export function NavigationComponent() {
  const publicNavItems = PUBLIC_ROUTES.map((route) => ({
    href: route,
    label:
      route === "/" ? "Home" : route.replace("/auth/", "").replace("/", ""),
    isPublic: true,
  }));

  const protectedNavItems = PROTECTED_ROUTES.map((route) => ({
    href: route,
    label: route.replace("/", "").charAt(0).toUpperCase() + route.slice(2),
    isPublic: false,
  }));

  return { publicNavItems, protectedNavItems };
}
