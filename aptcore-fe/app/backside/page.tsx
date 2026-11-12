'use client'

import { useBreadcrumbs } from "../_providers/BreadcrumbContext"
import { useEffect, useState } from "react"
import DashboardAdmin from "./dashboard/admin"
import DashboardUser from "./dashboard/user"
import { useAcl } from "@/lib/acl"
import LoadingContent from "@/components/element/loading-section"

export default function Backside() {
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs([{ label: 'Dashboard' }])
  }, [setBreadcrumbs])

  const { hasRole, isLoading: aclLoading } = useAcl()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (!aclLoading) {
      setIsAdmin(hasRole(['superdev', 'superadmin']))
    }
  }, [aclLoading, hasRole])

  if (isAdmin === null) {
    return (
      <LoadingContent />
    )
  }

  return isAdmin ? <DashboardAdmin /> : <DashboardUser />
}
