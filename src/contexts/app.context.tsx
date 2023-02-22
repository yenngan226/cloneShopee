import React, { createContext, useState } from 'react'
import { User } from 'src/types/user.type'
import { getAccessToken, getProfile } from 'src/utils/auth.utils'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessToken()),
  setIsAuthenticated: () => null,
  profile: getProfile(),
  setProfile: () => null
}

export const Appcontext = createContext<AppContextInterface>(initialAppContext)
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialAppContext.isAuthenticated
  )
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  return (
    <Appcontext.Provider
      value={{ isAuthenticated, setIsAuthenticated, profile, setProfile }}
    >
      {children}
    </Appcontext.Provider>
  )
}
