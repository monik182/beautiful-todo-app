import { createContext, useContext, useEffect, useState } from 'react'
import { GoogleAuthProvider, User, getAuth, onAuthStateChanged, signInAnonymously, signInWithPopup, signOut } from 'firebase/auth'
import { useFirebaseApp } from './FirebaseAppProvider'

type AuthContextType = {
  user: User | null
  signInAnonymous: () => Promise<void>
  signInWithGoogle: () => Promise<User | undefined>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const firebaseApp = useFirebaseApp()
  const [user, setUser] = useState<User | null>(null)
  const auth = getAuth(firebaseApp)
  const googleProvider = new GoogleAuthProvider()
  const storagedUser = localStorage.getItem('user')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
    })
    return () => unsubscribe()
  }, [auth])

  const signInAnonymous = async () => {
    try {
      const response = await signInAnonymously(auth)
      console.log('>>>>>Signed in anonymously:', response)
    } catch (error) {
      console.error('Error signing in anonymously:', error)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      setUser(result.user)
      return result.user
    } catch (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    if (storagedUser) {
      setUser(JSON.parse(storagedUser))
    } else {
    }
  }, [storagedUser])

  const value = {
    user,
    signInAnonymous,
    signInWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
