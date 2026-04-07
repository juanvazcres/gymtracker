import { useState } from 'react'
import { WorkoutDay, WorkoutLog, LoggedExercise, LoggedSet } from '@/lib/gym-types'
import { saveWorkoutLog, generateId } from '@/lib/gym-store'
import { Button } from '@/components/ui/button'
import { ExerciseLogger } from './exercise-logger'
import { ArrowLeft, Save, Clock } from 'lucide-react'

interface WorkoutSessionProps {
  day: WorkoutDay
  initialLog?: WorkoutLog
  onClose: () => void
  onSaved: () => void
}

export function WorkoutSession({ day, initialLog, onClose, onSaved }: WorkoutSessionProps) {
  const [exercises, setExercises] = useState<LoggedExercise[]>(
    initialLog?.exercises || day.exercises.map(ex => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: []
    }))
  )

  const updateExerciseSets = (exerciseIndex: number, sets: LoggedSet[]) => {
    const newExercises = [...exercises]
    newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], sets }
    setExercises(newExercises)
  }

  const handleSave = async () => {
    const log: WorkoutLog = {
      id: initialLog?.id || generateId(),
      date: initialLog?.date || new Date().toISOString(),
      dayId: day.id,
      dayNumber: day.dayNumber,
      dayName: day.name,
      exercises: exercises.filter(ex => ex.sets.length > 0)
    }
    
    await saveWorkoutLog(log)
    onSaved()
  }

  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
  const targetSets = day.exercises.reduce((sum, ex) => sum + ex.sets, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">Dia {day.dayNumber}</h2>
            <p className="text-sm text-muted-foreground">{day.name}</p>
          </div>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Guardar
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progreso de la sesion</span>
            <span className="font-medium">{totalSets}/{targetSets} series</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min((totalSets / targetSets) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Warmup Reminder */}
      <div className="p-4 rounded-lg border border-accent/30 bg-accent/5">
        <h3 className="text-sm font-medium text-accent mb-2">Calentamiento</h3>
        <ul className="space-y-1">
          {day.warmup.map((item, index) => (
            <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {item.description}
            </li>
          ))}
        </ul>
      </div>

      {/* Exercise Loggers */}
      <div className="space-y-4">
        {day.exercises.map((exercise, index) => (
          <ExerciseLogger
            key={exercise.id}
            exercise={exercise}
            exerciseNumber={index + 1}
            loggedSets={exercises[index]?.sets || []}
            onUpdateSets={(sets) => updateExerciseSets(index, sets)}
          />
        ))}
      </div>
    </div>
  )
}
