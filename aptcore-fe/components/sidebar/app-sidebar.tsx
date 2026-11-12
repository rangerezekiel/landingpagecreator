"use client"

import * as React from "react"
import {
  Airplay,
  Globe,
  BookText,
  FolderArchive,
  Users,
  Settings,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import AppTitle from "@/components/app-title"

const base = '/backside'


const data = {
  navMain: [
    {
      title: "Dashboard",
      url: `${base}`,
      icon: Airplay,
      permission: null,
    },
    {
      title: "Website Management",
      url: `${base}/website`,
      icon: Globe,
      permission: "website-index",
      items: [
        {
          title: "Banner",
          url: `${base}/website/:domain/config/banner`,
          section: 'BANNER',
          permission: null,
        },
        {
          title: "Hero",
          url: `${base}/website/:domain/config/hero`,
          section: 'HERO',
          permission: null,
        },
        {
          title: "About",
          url: `${base}/website/:domain/config/about`,
          section: 'ABOUT',
          permission: null,
        },
        {
          title: "E-Brochure",
          url: `${base}/website/:domain/config/e-brocure`,
          section: 'E_BROCURE',
          permission: null,
        },
        {
          title: "Location",
          url: `${base}/website/:domain/config/location`,
          section: 'LOCATION',
          permission: null,
        },
        {
          title: "Unit Types Accordion",
          url: `${base}/website/:domain/config/unit-types-accordion`,
          section: 'UNIT_TYPE_ACCORDION',
          permission: null,
        },
        {
          title: "Unit Types",
          url: `${base}/website/:domain/config/unit-types`,
          section: 'UNIT_TYPES',
          permission: null,
        },
        {
          title: "Showflat Viewing",
          url: `${base}/website/:domain/config/showflat-viewing`,
          section: 'SHOWFLAT_VIEWING',
          permission: null,
        },
        {
          title: "FAQ",
          url: `${base}/website/:domain/config/faq`,
          section: 'FAQ',
          permission: null,
        },
        {
          title: "Next Step",
          url: `${base}/website/:domain/config/next-step`,
          section: 'NEXT_STEP',
          permission: null,
        },
        {
          title: "What is Next",
          url: `${base}/website/:domain/config/what-is-next`,
          section: 'WHAT_IS_NEXT',
          permission: null,
        },
        {
          title: "Developed by",
          url: `${base}/website/:domain/config/developed-by`,
          section: 'DEVELOPED_BY',
          permission: null,
        },
        {
          title: "Video",
          url: `${base}/website/:domain/config/video`,
          section: 'VIDEO',
          permission: null,
        },
        {
          title: "Simillar Project",
          url: `${base}/website/:domain/config/simillar-project`,
          section: 'SIMILLAR_PROJECT',
          permission: null,
        },
        {
          title: "Form Submission",
          url: `${base}/website/:domain/config/form-submission`,
          section: 'DEVELOPED_BY',
          permission: null,
        },
        {
          title: "Website Setting",
          url: `${base}/website/:domain/config/web-setting`,
          section: 'WEB_SETTING',
          permission: null,
        },
      ]
    },
    {
      title: "User Management",
      url: "#",
      icon: Users,
      permission: "user-management-admin", // Special permission for admin only
      items: [
        {
          title: "User",
          url: `${base}/user-management/user`,
          permission: 'user-index'
        },
        {
          title: "Role",
          url: `${base}/user-management/role`,
          permission: 'role-index'
        },
        {
          title: "Permission",
          url: `${base}/user-management/permission`,
          permission: 'permission-index'
        },
      ],
    },
    {
      title: "Activity Log",
      url: `${base}/activity-log`,
      icon: FolderArchive,
      permission: 'activity-log-index',
    },
    {
      title: "Form Submission",
      url: `${base}/form-submission`,
      icon: BookText,
      permission: null,
    },
    {
      title: "Account Settings",
      url: `${base}/account`,
      icon: Settings,
      permission: null,
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
