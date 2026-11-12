'use client'

import { useDomain } from "@/app/_providers/DomainContext"
import { useBreadcrumbs } from "@/app/_providers/BreadcrumbContext"
import { useEffect } from "react"
import DomainTitle from "@/components/element/domain-title"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WebsiteConfigSections from "./_sections"
import WebsiteConfigDetail from "./_detail"

const moduleTitle = 'Website Config'

export default function WebsiteConfigTabs() {
  const { domain } = useDomain()
  const { setBreadcrumbs } = useBreadcrumbs()
  
  useEffect(() => {
    setBreadcrumbs([{ label: moduleTitle }])
  }, [setBreadcrumbs])

  return (
    <div className="lg:px-0 px-5 pb-5">
      <DomainTitle domain={domain} />
      <h1 className="mb-6 text-2xl font-bold">{moduleTitle}</h1>
      
      <Tabs defaultValue="sections" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="detail">Website Detail</TabsTrigger>
          <TabsTrigger value="sections">Website Section</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sections" className="mt-6">
          <WebsiteConfigSections />
        </TabsContent>
        
        <TabsContent value="detail" className="mt-6">
          <WebsiteConfigDetail />
        </TabsContent>
      </Tabs>
    </div>
  )
}
