'use client'

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { DomainProvider, useDomain } from "@/app/_providers/DomainContext"

function InnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { setDomain } = useDomain()

  useEffect(() => {
    // Extract domain from path (assumes path: /backside/website/[domain]/...)
    const parts = pathname.split('/')
    const domain = parts[3] || ''
    setDomain(domain)
  }, [pathname, setDomain])

  return <>{children}</>
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DomainProvider>
      <InnerLayout>{children}</InnerLayout>
    </DomainProvider>
  )
}
