import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth, googleProvider } from './config'

export function signInWithGoogle(): Promise<User> {
  return signInWithPopup(auth, googleProvider).then((result) => result.user)
}

export function logOut(): Promise<void> {
  return signOut(auth)
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}
