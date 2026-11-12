'use client'

import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useBreadcrumbs, BreadcrumbItem as T_BreadcrumbItem } from "@/app/_providers/BreadcrumbContext"

import { Skeleton } from "@/components/ui/skeleton"

export default function DynamicBreadcrumb() {
  const { breadcrumbs } = useBreadcrumbs()

  if (breadcrumbs.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Skeleton className="h-4 w-32 rounded-md" />
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <Skeleton className="h-4 w-24 rounded-md" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
        <BreadcrumbLink href="/backside">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {breadcrumbs.map((item: T_BreadcrumbItem, index: number) => (
          <div key={index} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator className="" />}
            <BreadcrumbItem className={item.href ? "" : ""}>
              {item.href ? (
                <BreadcrumbLink href={item.href}>
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}