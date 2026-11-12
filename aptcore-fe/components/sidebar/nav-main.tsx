"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation'
import Link from "next/link"
import { useAcl } from "@/lib/acl"
import { useGlobalContext } from "@/app/_providers/GlobalContextProvider"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import { indexData } from "@/app/_services/website"
import { indexData as formSubmissionIndexData } from "@/app/_services/form-submission"
import { Website } from "@/app/_types/website"
import { FetchApiResponse } from "@/app/_types/fetch"
import { ApiResponseIndex } from "@/app/_types/fetch"
import { FormSubmission } from "@/app/_types/form-submission"
import { Skeleton } from "@/components/ui/skeleton"

function isPathActive(currentPath: string, targetPath: string): boolean {
  if (targetPath === "/backside") return currentPath === "/backside"
  if (targetPath === "/backside/website") return currentPath === "/backside/website"
  return currentPath.startsWith(targetPath)
}

export function useResolvedDomain() {
  const pathname = usePathname()
  const context = useGlobalContext()
  const profileData = context

  const pathParts = pathname.split("/")
  const domainFromUrl =
    pathParts[1] === "backside" &&
    pathParts[2] === "website" &&
    pathParts[3] ? pathParts[3] : null

  const domain = domainFromUrl || profileData?.user?.website?.domain || ""

  return domain
}

type NavItem = {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  permission?: string | null
  badge?: number
  items?: {
    title: string
    url: string
    permission?: string | null
  }[]
}

export function NavMain({ items }: { items: NavItem[] }) {
  const { hasPermission, hasRole } = useAcl()
  const pathname = usePathname()
  const domain = useResolvedDomain()
  const context = useGlobalContext()
  const [websites, setWebsites] = useState<Website[]>([])
  const [isLoadingWebsites, setIsLoadingWebsites] = useState(false)
  const [expandedWebsiteManagement, setExpandedWebsiteManagement] = useState(false)
  const [formSubmissionCount, setFormSubmissionCount] = useState(0)

  // Check if user is admin
  const isAdmin = hasRole(['admin'])

  // Fetch websites when Website Management is expanded or when refresh is triggered
  useEffect(() => {
    const fetchWebsites = async () => {
      // Check if we're on a website page and should load websites
      const isOnWebsitePage = pathname.startsWith('/backside/website')
      const shouldLoadWebsites = expandedWebsiteManagement || isOnWebsitePage
      
      if (shouldLoadWebsites && websites.length === 0) {
        setIsLoadingWebsites(true)
        try {
          const response = await indexData("") as FetchApiResponse<ApiResponseIndex<Website>>
          if (response.status === 200 && response.data?.data) {
            setWebsites(response.data.data)
          }
        } catch (error) {
          console.error("Error fetching websites:", error)
        } finally {
          setIsLoadingWebsites(false)
        }
      }
    }

    fetchWebsites()
  }, [expandedWebsiteManagement, context.websiteRefreshTrigger, pathname, websites.length])

  // Fetch form submission count (unread only)
  useEffect(() => {
    const fetchFormSubmissionCount = async () => {
      try {
        const response = await formSubmissionIndexData("?perPage=1000") as FetchApiResponse<ApiResponseIndex<FormSubmission>>
        if (response.status === 200 && response.data?.data) {
          // Count only unread submissions (readAt is null)
          const unreadCount = response.data.data.filter(submission => submission.readAt === null).length
          setFormSubmissionCount(unreadCount)
        } else {
          // The API answers 404 when nothing is left, so the badge has to clear itself
          setFormSubmissionCount(0)
        }
      } catch (error) {
        console.error("Error fetching form submission count:", error)
        setFormSubmissionCount(0)
      }
    }

    fetchFormSubmissionCount()
  }, [pathname, context.formSubmissionRefreshTrigger])

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasDomainPlaceholder = item.url.includes(":domain")
          const thisUrl = item.url.replace(":domain", domain)
          
          // Hide User Management menu for admin users
          if (item.title === "User Management" && isAdmin) {
            return null
          }
          
          const allowedSubItems = item.items?.filter(subItem =>
            !subItem.permission || hasPermission([subItem.permission])
          ) || []
          const hasAllowedChildren = allowedSubItems.length > 0
          const isPermitted = !item.permission || hasPermission([item.permission])
          const shouldRender = hasAllowedChildren || (!item.items && isPermitted)

          if (!shouldRender) return null

          const isActive = hasAllowedChildren
            ? allowedSubItems.some(sub => isPathActive(pathname, sub.url.replace(":domain", domain)))
            : isPathActive(pathname, thisUrl)

          const isDisabled = hasDomainPlaceholder && !domain

          // Check if we're on a website-related page to determine if Website Management should be open
          const isOnWebsitePage = pathname.startsWith('/backside/website')
          const shouldWebsiteManagementBeOpen = item.title === "Website Management" && isOnWebsitePage

          const renderLink = (children: React.ReactNode) => {
            return isDisabled ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-not-allowed opacity-50 peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded px-3 py-6 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm">
                      {children}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Please select website before
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Link href={thisUrl} className="flex items-center gap-2 w-full">
                {children}
              </Link>
            )
          }

          // Special handling for Website Management
          if (item.title === "Website Management") {
            return (
              <Collapsible 
                key={item.title} 
                asChild 
                defaultOpen={shouldWebsiteManagementBeOpen} 
                className="group/collapsible"
                onOpenChange={setExpandedWebsiteManagement}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* Websites List */}
                      <div className="px-3 py-2">
                        <div className="text-xs font-medium text-sidebar-foreground/70 mb-2">Websites</div>
                        
                        {/* All Websites Menu Item - Hidden for admin roles */}
                        {/* {!hasRole(['admin']) && ( */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href="/backside/website" className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className={pathname === "/backside/website" ? 'font-semibold' : ''}>
                                  All Websites
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        {/* )} */}
                        
                        {isLoadingWebsites ? (
                          // Loading skeletons
                          Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                              <Skeleton className="h-4 w-4 rounded" />
                              <Skeleton className="h-4 flex-1" />
                            </div>
                          ))
                        ) : (
                          websites.map((website) => {
                            const websiteUrl = `/backside/website/${website.domain}/config`
                            const isWebsiteActive = pathname.startsWith(`/backside/website/${website.domain}`)
                            const tooltipText = `${website.domain} (${website.active ? 'Active' : 'Inactive'})`
                            
                            return (
                              <SidebarMenuSubItem key={website.id}>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <SidebarMenuSubButton asChild>
                                        <Link href={websiteUrl} className="flex items-center gap-2">
                                          <div className={`min-w-2 w-2 h-2 rounded-full ${website.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                                          <span className={isWebsiteActive ? 'font-semibold' : ''}>
                                            {website.domain}
                                          </span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="center">
                                      {tooltipText}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </SidebarMenuSubItem>
                            )
                          })
                        )}
                      </div>
                      
                      {/* Website Sections */}
                      {domain && (
                        <>
                          {/* Separator */}
                          <div className="border-t border-sidebar-border mx-3 my-2" />
                          
                          {/* Section Management */}
                          <div className="px-3 py-2">
                            <div className="text-xs font-medium text-sidebar-foreground/70 mb-2">Website Sections</div>
                            {allowedSubItems.map((subItem) => {
                              const hasDomainInSub = subItem.url.includes(":domain")
                              const subUrl = subItem.url.replace(":domain", domain)
                              const subDisabled = hasDomainInSub && !domain
                              const isSubActive = isPathActive(pathname, subUrl)

                              return (
                                <SidebarMenuSubItem
                                  key={subItem.title}
                                  className={isSubActive ? 'bg-neutral-200 dark:bg-neutral-700 font-semibold rounded' : ''}
                                >
                                  <SidebarMenuSubButton asChild>
                                    {subDisabled ? (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className="cursor-not-allowed opacity-50 text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground text-sm group-data-[collapsible=icon]:hidden">
                                              {subItem.title}
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            Please select website before
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    ) : (
                                      <Link href={subUrl}>
                                        <span>{subItem.title}</span>
                                      </Link>
                                    )}
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )
                            })}
                          </div>
                        </>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          if (hasAllowedChildren) {
            return (
              <Collapsible key={item.title} asChild defaultOpen={isActive} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {allowedSubItems.map((subItem) => {
                        const hasDomainInSub = subItem.url.includes(":domain")
                        const subUrl = subItem.url.replace(":domain", domain)
                        const subDisabled = hasDomainInSub && !domain
                        const isSubActive = isPathActive(pathname, subUrl)

                        return (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            className={isSubActive ? 'bg-neutral-200 dark:bg-neutral-700 font-semibold rounded' : ''}
                          >
                            <SidebarMenuSubButton asChild>
                              {subDisabled ? (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="cursor-not-allowed opacity-50 text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground text-sm group-data-[collapsible=icon]:hidden">
                                        {subItem.title}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Please select website before
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <Link href={subUrl}>
                                  <span>{subItem.title}</span>
                                </Link>
                              )}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          return (
            <SidebarMenuItem key={item.title} className={isActive ? 'bg-neutral-200 dark:bg-neutral-700 font-semibold rounded' : ''}>
              <SidebarMenuButton asChild tooltip={item.title}>
                {renderLink(
                  <>
                    {item.icon && <item.icon/>}
                    <span>{item.title}</span>
                  </>
                )}
              </SidebarMenuButton>
              {item.title === "Form Submission" && formSubmissionCount > 0 && (
                <SidebarMenuBadge>
                  {formSubmissionCount}
                </SidebarMenuBadge>
              )}
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
