import { useState, useEffect } from 'react'
import { WorkoutDay, WorkoutLog } from '@/lib/gym-types'
import { getWorkoutDays, getWorkoutLogs } from '@/lib/gym-store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WorkoutDayCard } from '@/components/workout-day-card'
import { WorkoutSession } from '@/components/workout-session'
import { WorkoutHistory } from '@/components/workout-history'
import { ProgressCharts } from '@/components/progress-charts'
import { Dumbbell, Calendar, TrendingUp } from 'lucide-react'

export default function App() {
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([])
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
  const [activeSession, setActiveSession] = useState<WorkoutDay | null>(null)
  const [activeTab, setActiveTab] = useState('workout')

  useEffect(() => {
    (async () => {
      const days = await getWorkoutDays()
      const logs = await getWorkoutLogs()
      setWorkoutDays(days)
      setWorkoutLogs(logs)
    })()
  }, [])

  const refreshLogs = async () => {
    const logs = await getWorkoutLogs()
    setWorkoutLogs(logs)
  }

  const handleStartWorkout = (day: WorkoutDay) => {
    setActiveSession(day)
  }

  const handleCloseSession = () => {
    setActiveSession(null)
  }

  const handleSessionSaved = async () => {
    await refreshLogs()
    setActiveSession(null)
    setActiveTab('history')
  }

  // Get stats
  const totalWorkouts = workoutLogs.length
  const thisWeekWorkouts = workoutLogs.filter(log => {
    const logDate = new Date(log.date)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return logDate >= weekAgo
  }).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">GymTracker</h1>
                <p className="text-xs text-muted-foreground">Tu progreso, tu fuerza</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-right">
                <p className="font-medium">{totalWorkouts}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-right">
                <p className="font-medium text-primary">{thisWeekWorkouts}</p>
                <p className="text-xs text-muted-foreground">Esta semana</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeSession ? (
          <WorkoutSession
            day={activeSession}
            onClose={handleCloseSession}
            onSaved={handleSessionSaved}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="workout" className="gap-2">
                <Dumbbell className="h-4 w-4" />
                <span className="hidden sm:inline">Entrenar</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Historial</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Progreso</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workout" className="space-y-4">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-1">Rutina de entrenamiento</h2>
                <p className="text-sm text-muted-foreground">
                  Selecciona el dia que vas a entrenar
                </p>
              </div>
              <div className="grid gap-4">
                {workoutDays.map((day) => (
                  <WorkoutDayCard
                    key={day.id}
                    day={day}
                    onStartWorkout={handleStartWorkout}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-1">Historial de entrenamientos</h2>
                <p className="text-sm text-muted-foreground">
                  Revisa tus sesiones anteriores
                </p>
              </div>
              <WorkoutHistory logs={workoutLogs} onLogsChange={refreshLogs} />
            </TabsContent>

            <TabsContent value="progress">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-1">Graficos de progreso</h2>
                <p className="text-sm text-muted-foreground">
                  Visualiza tu evolucion por ejercicio
                </p>
              </div>
              <ProgressCharts logs={workoutLogs} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}
