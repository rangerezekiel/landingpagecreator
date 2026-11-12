// 🔁 Reusable types
type ValueField = { value: string }
type JsonButton = {
  jsonValue: {
    LINK: string
    TITLE: string
    SUBTITLE: string | null
    ICON: string | null
  }
}

// 🔁 Section & nested structures
export interface Section {
  id: string
  key: string
  title: string
  details: Record<string, SectionDetail>
}

export interface SectionDetail {
  id: string
  key: string
  label: string
  type: string
  value: string | null
  jsonValue: object | null
  sectionId: string
  items: SectionDetailItem[]
}

export interface SectionDetailItem {
  id: string
  sectionDetailId: string
  contents: Record<string, SectionContent>
}

export interface SectionContent {
  id: string
  sectionDetailItemId: string
  key: string
  type: string
  value: string | null
  jsonValue: object | null
}

// 🔁 Content Generics
type ContentWithValue<T extends string[]> = {
  [K in T[number]]: ValueField
}

type ContentWithJson<T extends string[]> = {
  [K in T[number]]: JsonButton
}

// 🔁 Payload helper
type BasePayload = {
  sectionType: string
}

// ========================================
// 🎯 Actual Payloads (shortened)
// ========================================

export type BannerApiResponse = {
  active: boolean
  details: {
    LIST: {
      items: BannerPayload[]
    }
  }
}

export type BannerPayload = BasePayload & {
  background: string
  title: string
  description: string
  buttonLink: string
  buttonTitle: string
  sortOrder: number
  detailId?: string
  editId?: string | null
  contents: {
    BACKGROUND: ValueField
    TITLE: ValueField
    DESCRIPTION: ValueField
    BUTTON: JsonButton
  }
}

export type VideoApiResponse = {
  active: boolean
  details: {
    LIST: {
      items: VideoPayload[]
    }
  }
}

export type VideoPayload = BasePayload & {
  thumbnail: string
  title: string
  description: string
  link: string
  sortOrder: number
  detailId?: string
  editId?: string | null
  contents: {
    THUMBNAIL: ValueField
    TITLE: ValueField
    DESCRIPTION: ValueField
    LINK: ValueField
  }
}

export type HeroPayload = BasePayload & {
  content: string
  buttonLink: string
  buttonTitle: string
  buttonSubtitle: string
  background: string
}

export type HeroContent = {
  active: boolean
  details: {
    BACKGROUND: ValueField
    CONTENT: ValueField
    REGISTER_BUTTON: JsonButton
  }
}

export type AboutPayload = BasePayload & {
  content: string
  title: string
  image: string
}

export type AboutContent = {
  active: boolean
  details: ContentWithValue<["IMAGE", "CONTENT", "TITLE"]>
}

export type EBrocurePayload = BasePayload & {
  title: string
  description: string
  image: string
  buttonLink: string
  buttonTitle: string
}

export type EBrocureContent = {
  active: boolean
  details: ContentWithValue<["DESCRIPTION", "TITLE", "IMAGE"]> & ContentWithJson<["BUTTON"]>
}

export type ShowflatViewingPayload = BasePayload & {
  title: string
  description: string
  image: string
  hotlineButtonLink: string
  hotlineButtonTitle: string
  requestButtonLink: string
  requestButtonTitle: string
}

export type ShowflatViewingContent = {
  active: boolean
  details: ContentWithValue<["DESCRIPTION", "TITLE", "IMAGE"]> & ContentWithJson<["REQUEST_BUTTON", "HOTLINE_BUTTON"]>
}

export type DevelopedByPayload = BasePayload & {
  background: string
  logo: string
  description: string
}

export type DevelopedByContent = {
  active: boolean
  details: ContentWithValue<["BACKGROUND", "LOGO", "DESCRIPTION"]>
}

export type FormSubmissionPayload = BasePayload & {
  content: string
  image: string
  photo?: string | null
  privyrEnabled: boolean
  privyrWebhookUrl?: string | null
}

export type FormSubmissionContent = {
  active: boolean
  details: ContentWithValue<["CONTENT", "BACKGROUND", "PRIVYR_ENABLED"]> & {
    // Secret, so the API strips it for unauthenticated readers. Present only
    // when the backside config page reads this section with a JWT.
    PRIVYR_WEBHOOK_URL?: ValueField
    // Optional, so it is absent on sections created before the PHOTO migration.
    PHOTO?: ValueField
  }
}

export type FAQPayload = BasePayload & {
  image: string
}

export type FAQContent = {
  details: ContentWithValue<["IMAGE"]>
}


export type FAQContents = {
  active: boolean
  details: ContentWithValue<["IMAGE"]> & {
    LIST: {
      items: {
        contents:
          ContentWithValue<["TITLE", "DESCRIPTION"]>
      }[]
      }
  } | null
}

export type FAQListPayload = BasePayload & {
  title: string
  description: string
  sortOrder: number
  editId?: string | null
  contents: ContentWithValue<["TITLE", "DESCRIPTION"]>
}

export type WhatIsNextPayload = BasePayload & {
  title: string
}

export type WhatIsNextContent = {
  details: ContentWithValue<["TITLE"]>
}

export type WhatIsNextContents = { 
  active: boolean
  details: ContentWithValue<["TITLE"]> & {
  LIST: {
    items: {
      contents:
      ContentWithValue<["SUBTITLE", "TITLE", "DESCRIPTION"]>
    }[]
  }
}} | null

export type WhatIsNextListPayload = BasePayload & {
  title: string
  subtitle: string
  description: string
  sortOrder: number
  editId?: string | null
  contents: ContentWithValue<["SUBTITLE", "TITLE", "DESCRIPTION"]>
}

export type UnitTypesAccordionPayload = BasePayload & {
  title: string
  image: string
  description: string
}

export type UnitTypesAccordionContents = { 
  active: boolean
  details: ContentWithValue<["TITLE", "DESCRIPTION", "IMAGE"]> & {
  LIST: {
    items: {
      contents:
      UnitTypesAccordionListContents
    }[]
  }
}} | null

export type UnitTypesAccordionListContents = ContentWithValue<["TITLE", "DESCRIPTION"]>

export type UnitTypesAccordionContent = {
  details: ContentWithValue<["TITLE", "DESCRIPTION", "IMAGE"]>
}

export type UnitTypesAccordionListPayload = BasePayload & {
  title: string
  description: string
  sortOrder: number
  editId?: string | null
  contents: ContentWithValue<["TITLE", "DESCRIPTION"]>
}

export type NextStepPayload = BasePayload & 
ContentWithValue<["TITLE", "DESCRIPTION"]>


export type NextStepContents = {
  active: boolean
  details: ContentWithValue<["TITLE","DESCRIPTION"]> & {
  LIST: {
    items: {
      contents:
      NextStepListContent
    }[]
  }
}} | null

export type NextStepContent = {
  details: ContentWithValue<["TITLE", "DESCRIPTION"]> & {
    BUTTON: JsonButton
  }
}

export type NextStepListContent = ContentWithValue<["BACKGROUND", "TITLE", "DESCRIPTION", "SUBTITLE"]> & {
  BUTTON: JsonButton
}

export type NextStepListPayload = BasePayload & {
  title: string
  description: string
  sortOrder: number
  editId?: string | null
  contents: NextStepListContent
}

export type UnitTypesPayload = BasePayload & 
ContentWithValue<["TITLE"]> & ContentWithJson<["BUTTON"]>

export type UnitTypesContent = {
  details: ContentWithValue<["TITLE"]> & ContentWithJson<["BUTTON"]>
}

export type UnitTypesContents = {
  active: boolean
  details: ContentWithValue<["TITLE"]> & ContentWithJson<["BUTTON"]> & {
  LIST: {
    items: {
      contents:
      UnitTypesListContent
    }[]
  }
}} | null

export type UnitTypesListContent = ContentWithValue<["IMAGE", "TITLE", "DESCRIPTION", "SUBTITLE"]> & {
  BUTTON: JsonButton
}

export type UnitTypesListPayload = BasePayload & {
  title: string
  sortOrder: number
  editId?: string | null
  contents: UnitTypesListContent
}


export type LocationPayload = BasePayload & 
ContentWithValue<["TITLE"]> & ContentWithJson<["BUTTON"]>

export type LocationContent = {
  details: ContentWithValue<["TITLE"]> & ContentWithJson<["BUTTON"]>
}

export type LocationHighlightContents = {
  contents:
  LocationHighlightContent
}

export type LocationHighlightContent = ContentWithValue<["BACKGROUND", "TITLE"]>

export type LocationHighlightPayload = BasePayload & {
  title: string
  sortOrder: number
  editId?: string | null
  contents: LocationHighlightContent
}

export type LocationListContents = {
  contents:
  LocationListContent
}

export type LocationListContent = ContentWithValue<["DESCRIPTION", "TITLE"]>

export type LocationListPayload = BasePayload & {
  title: string
  sortOrder: number
  editId?: string | null
  contents: LocationListContent
}


export type LocationContents = {
  active: boolean
  details: ContentWithValue<["TITLE"]> 
  & ContentWithJson<["BUTTON"]> & {
    HIGHLIGHT: {
      items: LocationHighlightContents[]
    },
    LIST: {
      items: LocationListContents[]
    }
  } | null
}

export type SimillarProjectPayload = BasePayload & 
ContentWithValue<["TITLE", "DESCRIPTION"]>

export type SimillarProjectContent = {
  details: ContentWithValue<["TITLE", "DESCRIPTION"]>
}

export type SimillarProjectProjectsContents = {
  contents:
  SimillarProjectProjectsContent
}

export type SimillarProjectProjectsContent = ContentWithValue<["BACKGROUND", "TITLE", "WEBSITE_LINK"]>

export type SimillarProjectProjectsPayload = BasePayload & {
  title: string
  website_link: string
  sortOrder: number
  editId?: string | null
  contents: SimillarProjectProjectsContent
}

export type SimillarProjectContents = {
  active: boolean
  details: ContentWithValue<["TITLE", "DESCRIPTION"]> 
  & {
    PROJECTS: {
      items: SimillarProjectProjectsContents[]
    },
  } | null
}