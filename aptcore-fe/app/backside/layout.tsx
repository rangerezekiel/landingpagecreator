import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar"

import { cookies } from 'next/headers'

import { logoutProcess } from "@/app/_services/auth"
import { GlobalContextProvider } from "@/app/_providers/GlobalContextProvider"
import { fetchApi } from "@/lib/api"
import { MeState } from "@/app/_types/user"

import DynamicBreadcrumb from "@/components/dynamic-breadcrumb"

import { BreadcrumbProvider } from "@/app/_providers/BreadcrumbContext"
import { Metadata } from "next"
import { DomainProvider } from "@/app/_providers/DomainContext"



const title = 'Dashboard'
export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description: "Created by 🔥",
}

export default async function BacksideLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('token')?.value

  let profileData: MeState | null = {
    user: null,
    permissions: []
  }

  try {
    const response = await fetchApi('/auth/me', {}, authToken)
    if (response.status == 200) {
      profileData = await response.data as MeState
    } else if (response.status === 401 || response.status === 403) {
      await logoutProcess()
    } else {
      console.error('Failed to fetch profile data:', response.status)
    }
  } catch (error) {
    console.error('Error fetching profile data:', error)
  }

  return (
    <DomainProvider>
      <GlobalContextProvider profileData={profileData}>
        <BreadcrumbProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-fit py-3 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-fit">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                  />
                  <DynamicBreadcrumb />
                </div>
              </header>
              <main className="px-0 lg:px-5 lg:py-2">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </BreadcrumbProvider>
      </GlobalContextProvider>
    </DomainProvider>
  )

}