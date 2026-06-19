import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCvw0UwC5T_GiRVROQFmXVysaqGNUcOE2g",
  authDomain: "armonia-2e16f.firebaseapp.com",
  projectId: "armonia-2e16f",
  storageBucket: "armonia-2e16f.firebasestorage.app",
  messagingSenderId: "205907563468",
  appId: "1:205907563468:web:942d657b7c415c5f238369",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
