'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type DomainContextType = {
  domain: string
  setDomain: (value: string) => void
}

const DomainContext = createContext<DomainContextType | undefined>(undefined)

export const DomainProvider = ({ children }: { children: ReactNode }) => {
  const [domain, setDomain] = useState<string>('')

  return (
    <DomainContext.Provider value={{ domain, setDomain }}>
      {children}
    </DomainContext.Provider>
  )
}

export const useDomain = () => {
  const context = useContext(DomainContext)
  if (!context) {
    throw new Error('useDomain must be used within a DomainProvider')
  }
  return context
}
