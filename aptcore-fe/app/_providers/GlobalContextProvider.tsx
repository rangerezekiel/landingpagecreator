"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { MeState } from "@/app/_types/user";
import { storageUrl } from "@/app/_utils/objectTransformers";

interface GlobalContextType {
  user: MeState['user']
  permissions: MeState['permissions']
  websiteRefreshTrigger: number
  triggerWebsiteRefresh: () => void
  formSubmissionRefreshTrigger: number
  triggerFormSubmissionRefresh: () => void
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export function GlobalContextProvider({ 
  children, 
  profileData 
}: { 
  children: ReactNode
  profileData: MeState | null
}) {
  const [websiteRefreshTrigger, setWebsiteRefreshTrigger] = useState(0)
  const [formSubmissionRefreshTrigger, setFormSubmissionRefreshTrigger] = useState(0)

  const triggerWebsiteRefresh = () => {
    setWebsiteRefreshTrigger(prev => prev + 1)
  }

  const triggerFormSubmissionRefresh = () => {
    setFormSubmissionRefreshTrigger(prev => prev + 1)
  }

  const resolvedProfile: GlobalContextType = {
    user: profileData?.user
      ? {
          ...profileData.user,
          avatar: profileData.user.avatar
            ? storageUrl(profileData.user.avatar)
            : null,
        }
      : null,
    permissions: profileData?.permissions || [],
    websiteRefreshTrigger,
    triggerWebsiteRefresh,
    formSubmissionRefreshTrigger,
    triggerFormSubmissionRefresh
  }

  return (
    <GlobalContext.Provider value={resolvedProfile}>
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobalContext() {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalContextProvider')
  }
  return context
}