'use client'

import { useBreadcrumbs } from "@/app/_providers/BreadcrumbContext"
import { useAcl } from "@/lib/acl"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/stores/auth"
import { showData } from "@/app/_services/website"
import ThisIndex from "@/app/backside/website"
import { useRouter } from "next/navigation"
import LoadingContent from "@/components/element/loading-section"

const moduleTitle = 'Website'

export default function IndexPage() {
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs([{ label: moduleTitle }])
  }, [setBreadcrumbs])

  const router = useRouter()

  const websiteId = useAuthStore(state => state.user?.websiteId)
  const [isLoading, setIsLoading] = useState(false)

  const { hasRole } = useAcl()

  useEffect(() => {
    const fetchWebsite = async () => {
      if (!hasRole(['superdev', 'superadmin', 'admin']) && websiteId) {
        setIsLoading(true)
        const data = await showData(websiteId)
        if (data?.data?.domain) {
          router.push(`/backside/website/${data.data.domain}/config`)
        }
      }else{
        setIsLoading(false)
      }
    }

    fetchWebsite()
  }, [websiteId, hasRole, router])

    return (
    <>
        {isLoading ? (
            <LoadingContent />
        ) : (
            <ThisIndex />
        )}
    </>
    )

}
