import { createContext, useContext, useState, type ReactNode } from 'react'

export type User = { email: string; username: string; password: string }
type Ctx = {
  user: User | null
  loggedIn: boolean
  signup: (u: User) => void
  login: (email: string, password: string, remember: boolean) => string | null
  logout: () => void
}

// Front-end demo only: replace these with real API calls when a backend exists.
const USER_KEY = 'dashstack_user'
const SESSION_KEY = 'dashstack_session'

const read = (): User | null => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null') } catch { return null }
}
const hasSession = () => {
  try { return localStorage.getItem(SESSION_KEY) === '1' || sessionStorage.getItem(SESSION_KEY) === '1' } catch { return false }
}

const AuthContext = createContext<Ctx>(null as unknown as Ctx)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(read)
  const [loggedIn, setLoggedIn] = useState<boolean>(hasSession)

  const signup = (u: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setUser(u)
  }
  const login = (email: string, password: string, remember: boolean) => {
    const saved = read()
    if (!saved) return 'No account found. Please sign up first.'
    if (saved.email.toLowerCase() !== email.trim().toLowerCase() || saved.password !== password) return 'Incorrect email or password.'
    ;(remember ? localStorage : sessionStorage).setItem(SESSION_KEY, '1')
    setLoggedIn(true)
    return null
  }
  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    setLoggedIn(false)
  }
  return <AuthContext.Provider value={{ user, loggedIn, signup, login, logout }}>{children}</AuthContext.Provider>
}
