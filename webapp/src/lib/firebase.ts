import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDataConnect } from 'firebase/data-connect'

// Web app's official Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD6lD0Ja_083J0i9f_LyZz5XRb86rf1sC8',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'gen-lang-client-0247041905.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0247041905',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'gen-lang-client-0247041905.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '700321455683',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:700321455683:web:f1d1825d5b42162e51fef6',
}

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Firebase Authentication
export const auth = getAuth(app)

// Firebase Data Connect (SQL Connect for PostgreSQL)
export const dataConnect = getDataConnect(app, {
  connector: 'default',
  location: 'us-central1',
  service: 'clinic-os-service',
})

export default app
