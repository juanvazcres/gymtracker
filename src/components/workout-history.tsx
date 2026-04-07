import { useState } from 'react'
import { WorkoutLog } from '@/lib/gym-types'
import { deleteWorkoutLog } from '@/lib/gym-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Calendar, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

interface WorkoutHistoryProps {
  logs: WorkoutLog[]
  onLogsChange: () => void
}

export function WorkoutHistory({ logs, onLogsChange }: WorkoutHistoryProps) {
  const [expandedLog, setExpandedLog] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDelete = async (logId: string) => {
    await deleteWorkoutLog(logId)
    setDeleteConfirm(null)
    await onLogsChange?.()
  }

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Sin registros todavia</h3>
        <p className="text-sm text-muted-foreground">
          Completa tu primer entrenamiento para ver tu historial aqui
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedLogs.map((log) => {
        const isExpanded = expandedLog === log.id
        const totalSets = log.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)

        return (
          <Card key={log.id} className="border-border/50">
            <CardHeader 
              className="pb-2 cursor-pointer" 
              onClick={() => setExpandedLog(isExpanded ? null : log.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                    {log.dayNumber}
                  </div>
                  <div>
                    <CardTitle className="text-base">{log.dayName}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(log.date)} - {formatTime(log.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {totalSets} series
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-2">
                <div className="space-y-4">
                  {log.exercises.map((exercise, exIndex) => (
                    <div key={exIndex} className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-secondary text-xs">
                          {exIndex + 1}
                        </span>
                        {exercise.exerciseName}
                      </h4>
                      <div className="grid gap-1 pl-7">
                        {exercise.sets.map((set, setIndex) => (
                          <div 
                            key={setIndex}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <span className="w-4 text-right">{set.setNumber}.</span>
                            {set.duration ? (
                              <span>{set.duration}</span>
                            ) : (
                              <span>
                                {set.weight}{set.weightUnit} - {set.reps} reps
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 border-t border-border/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirm(log.id)
                      }}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar registro
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar registro</DialogTitle>
            <DialogDescription>
              Esta accion no se puede deshacer. El registro de entrenamiento sera eliminado permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
