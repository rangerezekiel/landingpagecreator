import { headers } from "next/headers"
import { fetchApi } from "@/lib/api"
import { Website } from "@/app/_types/website"

export type WebsiteSetting = {
  [key: string]: string | undefined
}

export type WebsiteInfo = {
  info: Website | null
  setting: WebsiteSetting | null
}

/**
 * Get website data server-side using the host from headers
 * This function can be used in Server Components and Server Actions
 */
export async function getWebsiteData(): Promise<WebsiteInfo> {
  try {
    const headersList = await headers()
    const host = headersList.get("host")

    if (!host) {
      console.error("No host found in headers")
      return { info: null, setting: null }
    }

    let webInfo: Website | null = null
    let webSetting: WebsiteSetting | null = null

    // Fetch website info
    try {
      const response = await fetchApi("/web/" + host, {})
      if (response.status === 200) {
        webInfo = response.data as Website
      }
    } catch (error) {
      console.error("Error fetching website data:", error)
    }

    // Fetch website settings
    try {
      const response = await fetchApi("/website-setting/" + host + "/keys", {})
      if (response.status === 200) {
        const data = response.data
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          webSetting = data as WebsiteSetting
        }
      }
    } catch (error) {
      console.error("Error fetching website setting:", error)
    }

    return { info: webInfo, setting: webSetting }
  } catch (error) {
    console.error("Error in getWebsiteData:", error)
    return { info: null, setting: null }
  }
}

/**
 * Get website data with a specific host
 * Useful for cases where you need to fetch data for a different domain
 */
export async function getWebsiteDataByHost(host: string): Promise<WebsiteInfo> {
  try {
    let webInfo: Website | null = null
    let webSetting: WebsiteSetting | null = null

    // Fetch website info
    try {
      const response = await fetchApi("/web/" + host, {})
      if (response.status === 200) {
        webInfo = response.data as Website
      }
    } catch (error) {
      console.error("Error fetching website data:", error)
    }

    // Fetch website settings
    try {
      const response = await fetchApi("/website-setting/" + host + "/keys", {})
      if (response.status === 200) {
        const data = response.data
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          webSetting = data as WebsiteSetting
        }
      }
    } catch (error) {
      console.error("Error fetching website setting:", error)
    }

    return { info: webInfo, setting: webSetting }
  } catch (error) {
    console.error("Error in getWebsiteDataByHost:", error)
    return { info: null, setting: null }
  }
}

/**
 * Get only website info (without settings)
 * Useful when you only need basic website data
 */
export async function getWebsiteInfo(): Promise<Website | null> {
  try {
    const headersList = await headers()
    const host = headersList.get("host")

    if (!host) {
      console.error("No host found in headers")
      return null
    }

    const response = await fetchApi("/web/" + host, {})
    if (response.status === 200) {
      return response.data as Website
    }
  } catch (error) {
    console.error("Error fetching website info:", error)
  }

  return null
}

/**
 * Get only website settings (without info)
 * Useful when you only need settings data
 */
export async function getWebsiteSettings(): Promise<WebsiteSetting | null> {
  try {
    const headersList = await headers()
    const host = headersList.get("host")

    if (!host) {
      console.error("No host found in headers")
      return null
    }

    const response = await fetchApi("/website-setting/" + host + "/keys", {})
    if (response.status === 200) {
      const data = response.data
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        return data as WebsiteSetting
      }
    }
  } catch (error) {
    console.error("Error fetching website settings:", error)
  }

  return null
}

/**
 * Validate if website data exists and is active
 * Returns true if website exists and is active, false otherwise
 */
export async function isWebsiteActive(): Promise<boolean> {
  try {
    const websiteInfo = await getWebsiteInfo()
    return websiteInfo?.active === true
  } catch (error) {
    console.error("Error checking website status:", error)
    return false
  }
}

/**
 * Get website domain from headers
 * Useful for getting the current domain in server components
 */
export async function getCurrentDomain(): Promise<string | null> {
  try {
    const headersList = await headers()
    return headersList.get("host")
  } catch (error) {
    console.error("Error getting current domain:", error)
    return null
  }
}
