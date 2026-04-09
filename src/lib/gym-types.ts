// Types for gym tracking app

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string // Can be "8-10" or "40s" for timed exercises
  isTimeBased?: boolean
}

export interface WarmupItem {
  description: string
}

export interface WorkoutDay {
  id: string
  dayNumber: number
  name: string
  muscleGroups: string
  warmup: WarmupItem[]
  exercises: Exercise[]
}

export interface LoggedSet {
  setNumber: number
  weight?: number
  weightUnit?: 'kg' | 'lbs'
  reps?: number
  rir?: number
  duration?: string // For timed exercises like "40s"
}

export interface LoggedExercise {
  exerciseId: string
  exerciseName: string
  sets: LoggedSet[]
}

export interface WorkoutLog {
  id: string
  date: string // ISO date string
  dayId: string
  dayNumber: number
  dayName: string
  exercises: LoggedExercise[]
}

// Default workout days based on user's program
export const defaultWorkoutDays: WorkoutDay[] = [
  {
    id: 'day-1',
    dayNumber: 1,
    name: 'Pecho, hombro, triceps',
    muscleGroups: 'Pecho, hombro, triceps',
    warmup: [
      { description: '5-7 min caminadora' },
      { description: 'Movilidad hombros' }
    ],
    exercises: [
      { id: 'ex-1-1', name: 'Press con mancuernas', sets: 4, reps: '8-10' },
      { id: 'ex-1-2', name: 'Press inclinado con mancuernas', sets: 3, reps: '10' },
      { id: 'ex-1-3', name: 'Press hombro con mancuernas', sets: 3, reps: '10' },
      { id: 'ex-1-4', name: 'Elevaciones laterales', sets: 3, reps: '12' },
      { id: 'ex-1-5', name: 'Triceps en polea', sets: 3, reps: '12' },
      { id: 'ex-1-6', name: 'Core: plancha', sets: 3, reps: '40s', isTimeBased: true }
    ]
  },
  {
    id: 'day-2',
    dayNumber: 2,
    name: 'Espalda y biceps',
    muscleGroups: 'Espalda y biceps',
    warmup: [
      { description: 'Remo suave 5 min' }
    ],
    exercises: [
      { id: 'ex-2-1', name: 'Jalon al pecho', sets: 4, reps: '10' },
      { id: 'ex-2-2', name: 'Remo en polea', sets: 3, reps: '10' },
      { id: 'ex-2-3', name: 'Remo con mancuerna', sets: 3, reps: '10' },
      { id: 'ex-2-4', name: 'Curl biceps mancuernas', sets: 3, reps: '12' },
      { id: 'ex-2-5', name: 'Curl martillo', sets: 3, reps: '12' },
      { id: 'ex-2-6', name: 'Core: Russian twists', sets: 3, reps: '20' }
    ]
  },
  {
    id: 'day-3',
    dayNumber: 3,
    name: 'Pierna completa',
    muscleGroups: 'Pierna completa',
    warmup: [
      { description: 'Bici 5 min' },
      { description: 'Movilidad cadera' }
    ],
    exercises: [
      { id: 'ex-3-1', name: 'Goblet squat', sets: 4, reps: '10' },
      { id: 'ex-3-2', name: 'Prensa de pierna', sets: 3, reps: '12' },
      { id: 'ex-3-3', name: 'Peso muerto rumano', sets: 3, reps: '10' },
      { id: 'ex-3-4', name: 'Lunges con mancuernas', sets: 3, reps: '10 por pierna' },
      { id: 'ex-3-5', name: 'Elevaciones de pantorrilla', sets: 3, reps: '15' },
      { id: 'ex-3-6', name: 'Core: plancha lateral', sets: 3, reps: '30s por lado', isTimeBased: true }
    ]
  }
]
