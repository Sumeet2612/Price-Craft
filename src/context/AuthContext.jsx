import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'pricecraft-user'
const USERS_KEY = 'pricecraft-users'

const readStoredUser = () => {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const readStoredUsers = () => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    }
  }, [user])

  const login = ({ email, password }) => {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const nextUsers = readStoredUsers()
    const matchedUser = nextUsers.find(
      (entry) => entry.email.toLowerCase() === normalizedEmail && entry.password === String(password || '')
    )

    if (!matchedUser) {
      throw new Error('Invalid email or password.')
    }

    const sessionUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email
    }

    setUser(sessionUser)
    return sessionUser
  }

  const signup = ({ name, email, password }) => {
    const nextUsers = readStoredUsers()
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!String(name || '').trim()) {
      throw new Error('Please enter your full name.')
    }

    if (!normalizedEmail || !String(password || '').trim()) {
      throw new Error('Email and password are required.')
    }

    const existingUser = nextUsers.find((entry) => entry.email.toLowerCase() === normalizedEmail)
    if (existingUser) {
      throw new Error('An account with this email already exists.')
    }

    const newUser = {
      id: `${Date.now()}`,
      name: String(name).trim(),
      email: normalizedEmail,
      password: String(password)
    }

    window.localStorage.setItem(USERS_KEY, JSON.stringify([...nextUsers, newUser]))

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }

    setUser(sessionUser)
    return sessionUser
  }

  const logout = () => setUser(null)

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
