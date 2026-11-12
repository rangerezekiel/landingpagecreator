import { headers } from "next/headers"
import { fetchApi } from "@/lib/api"
import {
  BannerApiResponse,
  BannerPayload,
  VideoApiResponse,
  VideoPayload,
  HeroContent,
  AboutContent,
  EBrocureContent,
  ShowflatViewingContent,
  DevelopedByContent,
  FormSubmissionContent,
  FAQContents,
  WhatIsNextContents,
  UnitTypesAccordionContents,
  NextStepContents,
  UnitTypesContents,
  LocationContents,
  SimillarProjectContents,
} from "@/app/_types/section"

// Union type for all possible section data types
type SectionData = 
  | BannerPayload[]
  | VideoPayload[]
  | HeroContent
  | AboutContent
  | EBrocureContent
  | ShowflatViewingContent
  | DevelopedByContent
  | FormSubmissionContent
  | FAQContents
  | WhatIsNextContents
  | UnitTypesAccordionContents
  | NextStepContents
  | UnitTypesContents
  | LocationContents
  | SimillarProjectContents
  | null

/**
 * Generic function to get section data
 */
async function getSectionData<T>(sectionType: string): Promise<T | null> {
  try {
    const headersList = await headers()
    const host = headersList.get("host")

    if (!host) {
      console.error("No host found in headers")
      return null
    }

    const response = await fetchApi("/section/" + host + "/" + sectionType, {})
    
    if (response.status === 200) {
      const result = response.data as { active: boolean; details: T }
      if (result.active) {
        return result.details
      }
    }
  } catch (error) {
    console.error(`Error fetching ${sectionType} data:`, error)
  }

  return null
}

/**
 * Generic function to get section data with a specific host
 */
async function getSectionDataByHost<T>(host: string, sectionType: string): Promise<T | null> {
  try {
    const response = await fetchApi("/section/" + host + "/" + sectionType, {})
    
    if (response.status === 200) {
      const result = response.data as { active: boolean; details: T }
      if (result.active) {
        return result.details
      }
    }
  } catch (error) {
    console.error(`Error fetching ${sectionType} data:`, error)
  }

  return null
}

// ========================================
// 🎯 Banner Section
// ========================================

export async function getBannerData(): Promise<BannerPayload[] | null> {
  try {
    const headersList = await headers()
    const host = headersList.get("host")

    if (!host) {
      console.error("No host found in headers")
      return null
    }

    const response = await fetchApi("/section/" + host + "/BANNER", {})
    
    if (response.status === 200) {
      const result = response.data as BannerApiResponse
      if (result.active) {
        return result.details.LIST.items
      }
    }
  } catch (error) {
    console.error("Error fetching banner data:", error)
  }

  return null
}

export async function getBannerDataByHost(host: string): Promise<BannerPayload[] | null> {
  try {
    const response = await fetchApi("/section/" + host + "/BANNER", {})
    
    if (response.status === 200) {
      const result = response.data as BannerApiResponse
      if (result.active) {
        return result.details.LIST.items
      }
    }
  } catch (error) {
    console.error("Error fetching banner data:", error)
  }

  return null
}

// ========================================
// 🎯 Video Section
// ========================================

export async function getVideoData(): Promise<VideoPayload[] | null> {
  try {
    const headersList = await headers()
    const host = headersList.get("host")

    if (!host) {
      console.error("No host found in headers")
      return null
    }

    const response = await fetchApi("/section/" + host + "/VIDEO", {})
    
    if (response.status === 200) {
      const result = response.data as VideoApiResponse
      if (result.active) {
        return result.details.LIST.items
      }
    }
  } catch (error) {
    console.error("Error fetching video data:", error)
  }

  return null
}

export async function getVideoDataByHost(host: string): Promise<VideoPayload[] | null> {
  try {
    const response = await fetchApi("/section/" + host + "/VIDEO", {})
    
    if (response.status === 200) {
      const result = response.data as VideoApiResponse
      if (result.active) {
        return result.details.LIST.items
      }
    }
  } catch (error) {
    console.error("Error fetching video data:", error)
  }

  return null
}

// ========================================
// 🎯 Hero Section
// ========================================

export async function getHeroData(): Promise<HeroContent["details"] | null> {
  return getSectionData<HeroContent["details"]>("HERO")
}

export async function getHeroDataByHost(host: string): Promise<HeroContent["details"] | null> {
  return getSectionDataByHost<HeroContent["details"]>(host, "HERO")
}

// ========================================
// 🎯 About Section
// ========================================

export async function getAboutData(): Promise<AboutContent["details"] | null> {
  return getSectionData<AboutContent["details"]>("ABOUT")
}

export async function getAboutDataByHost(host: string): Promise<AboutContent["details"] | null> {
  return getSectionDataByHost<AboutContent["details"]>(host, "ABOUT")
}

// ========================================
// 🎯 E-Brochure Section
// ========================================

export async function getEBrocureData(): Promise<EBrocureContent["details"] | null> {
  return getSectionData<EBrocureContent["details"]>("E_BROCURE")
}

export async function getEBrocureDataByHost(host: string): Promise<EBrocureContent["details"] | null> {
  return getSectionDataByHost<EBrocureContent["details"]>(host, "E_BROCURE")
}

// ========================================
// 🎯 Showflat Viewing Section
// ========================================

export async function getShowflatViewingData(): Promise<ShowflatViewingContent["details"] | null> {
  return getSectionData<ShowflatViewingContent["details"]>("SHOWFLAT_VIEWING")
}

export async function getShowflatViewingDataByHost(host: string): Promise<ShowflatViewingContent["details"] | null> {
  return getSectionDataByHost<ShowflatViewingContent["details"]>(host, "SHOWFLAT_VIEWING")
}

// ========================================
// 🎯 Developed By Section
// ========================================

export async function getDevelopedByData(): Promise<DevelopedByContent["details"] | null> {
  return getSectionData<DevelopedByContent["details"]>("DEVELOPED_BY")
}

export async function getDevelopedByDataByHost(host: string): Promise<DevelopedByContent["details"] | null> {
  return getSectionDataByHost<DevelopedByContent["details"]>(host, "DEVELOPED_BY")
}

// ========================================
// 🎯 Form Submission Section
// ========================================

export async function getFormSubmissionData(): Promise<FormSubmissionContent["details"] | null> {
  return getSectionData<FormSubmissionContent["details"]>("FORM_SUBMISSION")
}

export async function getFormSubmissionDataByHost(host: string): Promise<FormSubmissionContent["details"] | null> {
  return getSectionDataByHost<FormSubmissionContent["details"]>(host, "FORM_SUBMISSION")
}

// ========================================
// 🎯 FAQ Section
// ========================================

export async function getFAQData(): Promise<FAQContents | null> {
  try {
    const headersList = await headers()
    const host = headersList.get("host")

    if (!host) {
      console.error("No host found in headers")
      return null
    }

    const response = await fetchApi("/section/" + host + "/FAQ", {})
    
    if (response.status === 200) {
      const result = response.data as FAQContents
      if (result?.active) {
        return result
      }
    }
  } catch (error) {
    console.error("Error fetching FAQ data:", error)
  }

  return null
}

export async function getFAQDataByHost(host: string): Promise<FAQContents | null> {
  try {
    const response = await fetchApi("/section/" + host + "/FAQ", {})
    
    if (response.status === 200) {
      const result = response.data as FAQContents
      if (result?.active) {
        return result
      }
    }
  } catch (error) {
    console.error("Error fetching FAQ data:", error)
  }

  return null
}

// ========================================
// 🎯 What Is Next Section
// ========================================

export async function getWhatIsNextData(): Promise<WhatIsNextContents | null> {
  try {
    const headersList = await headers()
    const host = headersList.get("host")

    if (!host) {
      console.error("No host found in headers")
      return null
    }

    const response = await fetchApi("/section/" + host + "/WHAT_IS_NEXT", {})
    
    if (response.status === 200) {
      const result = response.data as WhatIsNextContents
      if (result?.active) {
        return result
      }
    }
  } catch (error) {
    console.error("Error fetching What Is Next data:", error)
  }

  return null
}

export async function getWhatIsNextDataByHost(host: string): Promise<WhatIsNextContents | null> {
  try {
    const response = await fetchApi("/section/" + host + "/WHAT_IS_NEXT", {})
    
    if (response.status === 200) {
      const result = response.data as WhatIsNextContents
      if (result?.active) {
        return result
      }
    }
  } catch (error) {
    console.error("Error fetching What Is Next data:", error)
  }

  return null
}

// ========================================
// 🎯 Unit Types Accordion Section
// ========================================

export async function getUnitTypesAccordionData(): Promise<UnitTypesAccordionContents | null> {
  try {
    const headersList = await headers()
    const host = headersList.get("host")

    if (!host) {
      console.error("No host found in headers")
      return null
    }

    const response = await fetchApi("/section/" + host + "/UNIT_TYPES_ACCORDION", {})
    
    if (response.status === 200) {
      const result = response.data as UnitTypesAccordionContents
      if (result?.active) {
        return result
      }
    }
  } catch (error) {
    console.error("Error fetching Unit Types Accordion data:", error)
  }

  return null
}

export async function getUnitTypesAccordionDataByHost(host: string): Promise<UnitTypesAccordionContents | null> {
  try {
    const response = await fetchApi("/section/" + host + "/UNIT_TYPES_ACCORDION", {})
    
    if (response.status === 200) {
      const result = response.data as UnitTypesAccordionContents
      if (result?.active) {
        return result
      }
    }
  } catch (error) {
    console.error("Error fetching Unit Types Accordion data:", error)
  }

  return null
}

// ========================================
// 🎯 Next Step Section
// ========================================

export async function getNextStepData(): Promise<NextStepContents | null> {
  try {
    const headersList = await headers()
    const host = headersList.get("host")

    if (!host) {
      console.error("No host found in headers")
      return null
    }

    const response = await fetchApi("/section/" + host + "/NEXT_STEP", {})
    
    if (response.status === 200) {
      const result = response.data as NextStepContents
      if (result?.active) {
        return result
      }
    }
  } catch (error) {
    console.error("Error fetching Next Step data:", error)
  }

  return null
}

export async function getNextStepDataByHost(host: string): Promise<NextStepContents | null> {
  try {
    const response = await fetchApi("/section/" + host + "/NEXT_STEP", {})
    
    if (response.status === 200) {
      const result = response.data as NextStepContents
      if (result?.active) {
        return result
      }
    }
  } catch (error) {
    console.error("Error fetching Next Step data:", error)
  }

  return null
}

// ========================================
// 🎯 Unit Types Section
// ========================================

export async function getUnitTypesData(): Promise<UnitTypesContents | null> {
  try {
    const headersList = await headers()
    const host = headersList.get("host")

    if (!host) {
      console.error("No host found in headers")
      return null
    }

    const response = await fetchApi("/section/" + host + "/UNIT_TYPES", {})
    
    if (response.status === 200) {
      const result = response.data as UnitTypesContents
      if (result?.active) {
        return result
      }
    }
  } catch (error) {
    console.error("Error fetching Unit Types data:", error)
  }

  return null
}

export async function getUnitTypesDataByHost(host: string): Promise<UnitTypesContents | null> {
  try {
    const response = await fetchApi("/section/" + host + "/UNIT_TYPES", {})
    
    if (response.status === 200) {
      const result = response.data as UnitTypesContents
      if (result?.active) {
        return result
      }
    }
  } catch (error) {
    console.error("Error fetching Unit Types data:", error)
  }

  return null
}

// ========================================
// 🎯 Location Section
// ========================================

export async function getLocationData(): Promise<LocationContents | null> {
  try {
    const headersList = await headers()
    const host = headersList.get("host")

    if (!host) {
      console.error("No host found in headers")
      return null
    }

    const response = await fetchApi("/section/" + host + "/LOCATION", {})
    
    if (response.status === 200) {
      const result = response.data as LocationContents
      if (result?.active) {
        return result
      }
    }
  } catch (error) {
    console.error("Error fetching Location data:", error)
  }

  return null
}

export async function getLocationDataByHost(host: string): Promise<LocationContents | null> {
  try {
    const response = await fetchApi("/section/" + host + "/LOCATION", {})
    
    if (response.status === 200) {
      const result = response.data as LocationContents
      if (result?.active) {
        return result
      }
    }
  } catch (error) {
    console.error("Error fetching Location data:", error)
  }

  return null
}

// ========================================
// 🎯 Simillar Project Section
// ========================================

export async function getSimillarProjectData(): Promise<SimillarProjectContents | null> {
  try {
    const headersList = await headers()
    const host = headersList.get("host")

    if (!host) {
      console.error("No host found in headers")
      return null
    }

    const response = await fetchApi("/section/" + host + "/SIMILLAR_PROJECT", {})
    
    if (response.status === 200) {
      const result = response.data as SimillarProjectContents
      if (result?.active) {
        return result
      }
    }
  } catch (error) {
    console.error("Error fetching Simillar Project data:", error)
  }

  return null
}

export async function getSimillarProjectDataByHost(host: string): Promise<SimillarProjectContents | null> {
  try {
    const response = await fetchApi("/section/" + host + "/SIMILLAR_PROJECT", {})
    
    if (response.status === 200) {
      const result = response.data as SimillarProjectContents
      if (result?.active) {
        return result
      }
    }
  } catch (error) {
    console.error("Error fetching Simillar Project data:", error)
  }

  return null
}

// ========================================
// 🎯 Utility Functions
// ========================================

/**
 * Check if a section is active
 */
export async function isSectionActive(sectionType: string): Promise<boolean> {
  try {
    const headersList = await headers()
    const host = headersList.get("host")

    if (!host) {
      return false
    }

    const response = await fetchApi("/section/" + host + "/" + sectionType, {})
    
    if (response.status === 200) {
      const result = response.data as { active: boolean }
      return result.active === true
    }
  } catch (error) {
    console.error(`Error checking ${sectionType} status:`, error)
  }

  return false
}

/**
 * Get multiple sections data at once
 */
export async function getMultipleSectionsData(sectionTypes: string[]): Promise<Record<string, SectionData>> {
  const results: Record<string, SectionData> = {}
  
  for (const sectionType of sectionTypes) {
    try {
      const data = await getSectionData<SectionData>(sectionType)
      if (data) {
        results[sectionType] = data
      }
    } catch (error) {
      console.error(`Error fetching ${sectionType}:`, error)
    }
  }
  
  return results
}

/**
 * Get all sections data for a website
 */
export async function getAllSectionsData(): Promise<Record<string, SectionData>> {
  const allSections = [
    "BANNER",
    "VIDEO", 
    "HERO",
    "ABOUT",
    "E_BROCURE",
    "SHOWFLAT_VIEWING",
    "DEVELOPED_BY",
    "FORM_SUBMISSION",
    "FAQ",
    "WHAT_IS_NEXT",
    "UNIT_TYPES_ACCORDION",
    "NEXT_STEP",
    "UNIT_TYPES",
    "LOCATION"
  ]
  
  return getMultipleSectionsData(allSections)
}
