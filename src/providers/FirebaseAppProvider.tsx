import { createContext, useContext } from 'react'
import { FirebaseApp, initializeApp } from 'firebase/app'

const FirebaseAppContext = createContext<FirebaseApp | undefined>(undefined)

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}


export const FirebaseAppProvider = ({ children }: { children: React.ReactNode }) => {
  const app = initializeApp(firebaseConfig)
  return (
    <FirebaseAppContext.Provider value={app}>
      {children}
    </FirebaseAppContext.Provider>
  )
}

export const useFirebaseApp = () => {
  const context = useContext(FirebaseAppContext)
  if (!context) throw new Error('useFirebaseApp must be used within FirebaseAppProvider')
  return context
}
