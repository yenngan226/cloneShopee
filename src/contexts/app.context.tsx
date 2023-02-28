import React, { createContext, useState } from 'react'
import { ExtendedPurchases } from 'src/types/purchase.type'
import { User } from 'src/types/user.type'
import { getAccessToken, getProfile } from 'src/utils/auth.utils'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  extendedPurchases: ExtendedPurchases[]
  setExtendedPurchases: React.Dispatch<
    React.SetStateAction<ExtendedPurchases[]>
  >
  reset: () => void
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessToken()),
  setIsAuthenticated: () => null,
  profile: getProfile(),
  setProfile: () => null,
  extendedPurchases: [],
  setExtendedPurchases: () => null,
  reset: () => null
}

export const Appcontext = createContext<AppContextInterface>(initialAppContext)
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialAppContext.isAuthenticated
  )
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  const [extendedPurchases, setExtendedPurchases] = useState<
    ExtendedPurchases[]
  >(initialAppContext.extendedPurchases)
  const reset = () => {
    console.log(123)

    setExtendedPurchases([])
    setProfile(null)
    setIsAuthenticated(false)
  }
  return (
    <Appcontext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        extendedPurchases,
        setExtendedPurchases,
        reset
      }}
    >
      {children}
    </Appcontext.Provider>
  )
}
