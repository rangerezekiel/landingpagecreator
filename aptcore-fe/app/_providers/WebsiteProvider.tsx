"use client"

import { Website } from "@/app/_types/website"
import { WebsiteContext } from "./WebsiteContext"

type WebsiteSetting = {
  [key: string]: string | undefined
}

export function WebsiteProvider({
  children,
  webInfo,
}: {
  children: React.ReactNode
  webInfo: {
    info: Website | null,
    setting: WebsiteSetting | null
}
}) {
  return (
    <WebsiteContext.Provider value={webInfo}>
      {children}
    </WebsiteContext.Provider>
  )
}
