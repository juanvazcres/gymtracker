import { useState, useMemo } from 'react'
import { WorkoutLog } from '@/lib/gym-types'
import { defaultWorkoutDays } from '@/lib/gym-types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { TrendingUp, BarChart3 } from 'lucide-react'

interface ProgressChartsProps {
  logs: WorkoutLog[]
}

export function ProgressCharts({ logs }: ProgressChartsProps) {
  // Get all unique exercises from workout days
  const allExercises = useMemo(() => {
    const exercises: { id: string; name: string; dayNumber: number }[] = []
    defaultWorkoutDays.forEach(day => {
      day.exercises.forEach(ex => {
        if (!ex.isTimeBased) {
          exercises.push({
            id: ex.id,
            name: ex.name,
            dayNumber: day.dayNumber
          })
        }
      })
    })
    return exercises
  }, [])

  const [selectedExercise, setSelectedExercise] = useState<string>(
    allExercises[0]?.name || ''
  )

  // Get progress data for selected exercise
  const progressData = useMemo(() => {
    if (!selectedExercise) return []

    const exerciseLogs = logs
      .filter(log =>
        log.exercises.some(ex => ex.exerciseName === selectedExercise)
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return exerciseLogs.map(log => {
      const exercise = log.exercises.find(ex => ex.exerciseName === selectedExercise)
      if (!exercise || exercise.sets.length === 0) return null

      // Calculate max weight and total volume
      const setsWithWeight = exercise.sets.filter(s => s.weight && s.reps)
      if (setsWithWeight.length === 0) return null

      const maxWeight = Math.max(...setsWithWeight.map(s => {
        // Normalize to kg for consistency
        const weight = s.weight || 0
        return s.weightUnit === 'lbs' ? weight * 0.453592 : weight
      }))

      const totalVolume = setsWithWeight.reduce((sum, s) => {
        const weight = s.weight || 0
        const normalizedWeight = s.weightUnit === 'lbs' ? weight * 0.453592 : weight
        return sum + (normalizedWeight * (s.reps || 0))
      }, 0)

      const avgReps = Math.round(
        setsWithWeight.reduce((sum, s) => sum + (s.reps || 0), 0) / setsWithWeight.length
      )

      return {
        date: new Date(log.date).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short'
        }),
        fullDate: log.date,
        maxWeight: Math.round(maxWeight * 10) / 10,
        totalVolume: Math.round(totalVolume),
        avgReps,
        sets: setsWithWeight.length
      }
    }).filter(Boolean)
  }, [logs, selectedExercise])

  // Group exercises by day
  const exercisesByDay = useMemo(() => {
    const grouped: Record<number, typeof allExercises> = {}
    allExercises.forEach(ex => {
      if (!grouped[ex.dayNumber]) grouped[ex.dayNumber] = []
      grouped[ex.dayNumber].push(ex)
    })
    return grouped
  }, [allExercises])

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Sin datos de progreso</h3>
        <p className="text-sm text-muted-foreground">
          Completa algunos entrenamientos para ver tu evolucion
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Exercise Selector */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Selecciona un ejercicio</CardTitle>
          <CardDescription>
            Elige el ejercicio del que quieres ver la evolucion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(exercisesByDay).map(([dayNum, exercises]) => (
              <div key={dayNum}>
                <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                  Dia {dayNum}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {exercises.map(ex => (
                    <Button
                      key={ex.id}
                      variant={selectedExercise === ex.name ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedExercise(ex.name)}
                      className="text-xs"
                    >
                      {ex.name}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Chart */}
      {progressData.length > 0 ? (
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">{selectedExercise}</CardTitle>
            </div>
            <CardDescription>
              Evolucion del peso maximo y volumen total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%" className="bg-muted-foreground">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="maxWeight"
                    name="Peso max (kg)"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalVolume"
                    name="Volumen (kg)"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--accent))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border/50">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {progressData[progressData.length - 1]?.maxWeight || 0}kg
                </p>
                <p className="text-xs text-muted-foreground">Ultimo peso max</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">
                  {progressData.length}
                </p>
                <p className="text-xs text-muted-foreground">Sesiones</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {progressData.length >= 2
                    ? `${(progressData[progressData.length - 1]!.maxWeight - progressData[0]!.maxWeight) > 0 ? '+' : ''}${(progressData[progressData.length - 1]!.maxWeight - progressData[0]!.maxWeight).toFixed(1)}kg`
                    : '-'}
                </p>
                <p className="text-xs text-muted-foreground">Progreso total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No hay registros para <span className="font-medium">{selectedExercise}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Completa un entrenamiento con este ejercicio para ver tu progreso
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
