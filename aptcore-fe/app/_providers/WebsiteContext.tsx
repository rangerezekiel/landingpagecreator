"use client"

import { createContext, useContext } from "react"
import { Website } from "@/app/_types/website"
type WebsiteSetting = {
  [key: string]: string | undefined
}

type WebsiteContextType = {
  info: Website | null
  setting: WebsiteSetting | null
}

export const WebsiteContext = createContext<WebsiteContextType | null>(null)

export const useWebsite = () => {
  const context = useContext(WebsiteContext)
  if (!context) {
    throw new Error("useWebsite must be used within a WebsiteProvider")
  }
  return context
}
