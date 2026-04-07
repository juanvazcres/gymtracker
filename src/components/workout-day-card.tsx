import { WorkoutDay } from '@/lib/gym-types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dumbbell, Play } from 'lucide-react'

interface WorkoutDayCardProps {
  day: WorkoutDay
  onStartWorkout: (day: WorkoutDay) => void
  onEditWorkout?: (day: WorkoutDay) => void
  onDeleteWorkout?: (day: WorkoutDay) => void
}

export function WorkoutDayCard({ day, onStartWorkout, onEditWorkout, onDeleteWorkout }: WorkoutDayCardProps) {
  return (
    <Card className="border-border/50 hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
              {day.dayNumber}
            </div>
            <div>
              <CardTitle className="text-lg">{day.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{day.exercises.length} ejercicios</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onEditWorkout?.(day)}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              Editar
            </Button>
            <Button
              onClick={() => onStartWorkout(day)}
              size="sm"
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Iniciar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Warmup Section */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              Calentamiento
            </h4>
            <ul className="space-y-1">
              {day.warmup.map((item, index) => (
                <li key={index} className="text-sm text-foreground/80 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  {item.description}
                </li>
              ))}
            </ul>
          </div>

          {/* Exercises Section */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              Entrenamiento
            </h4>
            <div className="grid gap-2">
              {day.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/20 text-primary text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium">{exercise.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Dumbbell className="h-3 w-3" />
                    <span>{exercise.sets} x {exercise.reps}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onDeleteWorkout?.(day)}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  )
}
