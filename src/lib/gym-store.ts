import { WorkoutDay, WorkoutLog, defaultWorkoutDays } from './gym-types'

const WORKOUT_DAYS_KEY = 'gym-workout-days'
const WORKOUT_LOGS_KEY = 'gym-workout-logs'

// Workout Days
export function getWorkoutDays(): WorkoutDay[] {
  if (typeof window === 'undefined') return defaultWorkoutDays
  
  const stored = localStorage.getItem(WORKOUT_DAYS_KEY)
  if (!stored) {
    localStorage.setItem(WORKOUT_DAYS_KEY, JSON.stringify(defaultWorkoutDays))
    return defaultWorkoutDays
  }
  return JSON.parse(stored)
}

export function saveWorkoutDays(days: WorkoutDay[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(WORKOUT_DAYS_KEY, JSON.stringify(days))
}

// Workout Logs
export function getWorkoutLogs(): WorkoutLog[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(WORKOUT_LOGS_KEY)
  if (!stored) return []
  return JSON.parse(stored)
}

export function saveWorkoutLog(log: WorkoutLog): void {
  if (typeof window === 'undefined') return
  
  const logs = getWorkoutLogs()
  const existingIndex = logs.findIndex(l => l.id === log.id)
  
  if (existingIndex >= 0) {
    logs[existingIndex] = log
  } else {
    logs.push(log)
  }
  
  localStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(logs))
}

export function deleteWorkoutLog(logId: string): void {
  if (typeof window === 'undefined') return
  
  const logs = getWorkoutLogs().filter(l => l.id !== logId)
  localStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(logs))
}

export function getLogsByExercise(exerciseName: string): WorkoutLog[] {
  const logs = getWorkoutLogs()
  return logs.filter(log => 
    log.exercises.some(ex => ex.exerciseName === exerciseName)
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
