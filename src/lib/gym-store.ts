import { WorkoutDay, WorkoutLog, defaultWorkoutDays } from './gym-types'
import { openDB } from 'idb'

const DB_NAME = 'gym-db'
const STORE_DAYS = 'workout-days'
const STORE_LOGS = 'workout-logs'

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_DAYS)
      db.createObjectStore(STORE_LOGS, { keyPath: 'id' })
    },
  })
}

// Workout Days
export async function getWorkoutDays(): Promise<WorkoutDay[]> {
  if (typeof window === 'undefined') return defaultWorkoutDays
  
  const db = await getDB()
  const stored = await db.get(STORE_DAYS, 'days')
  
  if (!stored) {
    await db.put(STORE_DAYS, defaultWorkoutDays, 'days')
    return defaultWorkoutDays
  }
  return stored
}

export async function saveWorkoutDays(days: WorkoutDay[]): Promise<void> {
  if (typeof window === 'undefined') return
  const db = await getDB()
  await db.put(STORE_DAYS, days, 'days')
}

// Workout Logs
export async function getWorkoutLogs(): Promise<WorkoutLog[]> {
  if (typeof window === 'undefined') return []
  
  const db = await getDB()
  return await db.getAll(STORE_LOGS)
}

export async function saveWorkoutLog(log: WorkoutLog): Promise<void> {
  if (typeof window === 'undefined') return
  
  const db = await getDB()
  await db.put(STORE_LOGS, log)
}

export async function deleteWorkoutLog(logId: string): Promise<void> {
  if (typeof window === 'undefined') return
  
  const db = await getDB()
  await db.delete(STORE_LOGS, logId)
}

export async function getLogsByExercise(exerciseName: string): Promise<WorkoutLog[]> {
  const logs = await getWorkoutLogs()
  return logs.filter(log => 
    log.exercises.some(ex => ex.exerciseName === exerciseName)
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
