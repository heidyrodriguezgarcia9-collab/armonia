import { db } from './config'
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  writeBatch,
} from 'firebase/firestore'
import type { Task, Category } from '../types'

function tasksCol(uid: string) {
  return collection(db, 'users', uid, 'tasks')
}

function taskDoc(uid: string, taskId: string) {
  return doc(db, 'users', uid, 'tasks', taskId)
}

function categoriesDoc(uid: string) {
  return doc(db, 'users', uid, 'config', 'categories')
}

export async function loadUserData(uid: string): Promise<{ tasks: Task[]; categories: Category[] }> {
  const tasks: Task[] = []
  const tasksSnap = await getDocs(tasksCol(uid))
  tasksSnap.forEach((d) => tasks.push(d.data() as Task))

  const catSnap = await getDoc(categoriesDoc(uid))
  const categories: Category[] = catSnap.exists() ? catSnap.data().items ?? [] : []

  return { tasks, categories }
}

export async function saveTask(uid: string, task: Task) {
  await setDoc(taskDoc(uid, task.id), task)
}

export async function saveTasksBatch(uid: string, tasks: Task[]) {
  const batch = writeBatch(db)
  tasks.forEach((t) => {
    batch.set(taskDoc(uid, t.id), t)
  })
  await batch.commit()
}

export async function deleteTask(uid: string, taskId: string) {
  await deleteDoc(taskDoc(uid, taskId))
}

export async function saveCategories(uid: string, categories: Category[]) {
  await setDoc(categoriesDoc(uid), { items: categories })
}

export async function saveAllData(uid: string, tasks: Task[], categories: Category[]) {
  const batch = writeBatch(db)
  tasks.forEach((t) => {
    batch.set(taskDoc(uid, t.id), t)
  })
  batch.set(categoriesDoc(uid), { items: categories }, { merge: true })
  await batch.commit()
}
