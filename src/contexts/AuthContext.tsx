import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import type { Language, UserProfile } from "../types"

interface AuthContextValue {
  user: UserProfile | null
  isAuthenticated: boolean
  login: (user: UserProfile) => void
  logout: () => void
  updateProfile: (patch: Partial<UserProfile>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = "sfa_auth_user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as UserProfile) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = useCallback((u: UserProfile) => setUser(u), [])
  const logout = useCallback(() => setUser(null), [])

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev))
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, login, logout, updateProfile }),
    [user, login, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export const defaultProfile = (lang: Language): UserProfile => ({
  name: "",
  mobile: "",
  email: "",
  location: "",
  state: "Maharashtra",
  farmSize: "2",
  cropType: "Wheat",
  language: lang,
  farmName: "",
})