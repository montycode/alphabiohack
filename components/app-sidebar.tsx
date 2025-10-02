"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Image from "next/image"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { SITE_DATA } from "@/constants"
import { getSidebarConfig } from "@/lib/config/sidebar";
import { useTherapistConfig } from "@/hooks"
import { useTranslations } from "next-intl"

// Hook para determinar el rol del usuario
function useUserRole() {
  const { isSingleTherapistMode } = useTherapistConfig()
  
  return {
    isTherapist: isSingleTherapistMode, // Therapist = Admin
    isRegularUser: !isSingleTherapistMode, // Usuario regular
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("Sidebar");
  const { isTherapist } = useUserRole();

  // Función para generar la data del sidebar basada en el rol del usuario
  const data = getSidebarConfig(t, isTherapist);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-secondary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image src={SITE_DATA.logo} alt={SITE_DATA.name} width={32} height={32} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{SITE_DATA.name}</span>
                  <span className="truncate text-xs">{SITE_DATA.description}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
