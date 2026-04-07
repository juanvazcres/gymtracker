import { useState } from 'react'
import { WorkoutDay, Exercise } from '@/lib/gym-types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus } from 'lucide-react'
import { generateId } from '@/lib/gym-store'

interface RoutineEditorProps {
  day: WorkoutDay
  isOpen: boolean
  onClose: () => void
  onSave: (updatedDay: WorkoutDay) => void
}

export function RoutineEditor({ day, isOpen, onClose, onSave }: RoutineEditorProps) {
  const [editedDay, setEditedDay] = useState<WorkoutDay>(day)

  const handleExerciseChange = (index: number, field: keyof Exercise, value: any) => {
    const newExercises = [...editedDay.exercises]
    newExercises[index] = { ...newExercises[index], [field]: value }
    setEditedDay({ ...editedDay, exercises: newExercises })
  }

  const handleAddExercise = () => {
    const newExercise: Exercise = {
      id: generateId(),
      name: 'Nuevo Ejercicio',
      sets: 3,
      reps: '10'
    }
    setEditedDay({ ...editedDay, exercises: [...editedDay.exercises, newExercise] })
  }

  const handleRemoveExercise = (index: number) => {
    const newExercises = [...editedDay.exercises]
    newExercises.splice(index, 1)
    setEditedDay({ ...editedDay, exercises: newExercises })
  }

  const handleWarmupChange = (index: number, value: string) => {
    const newWarmup = [...editedDay.warmup]
    newWarmup[index] = { description: value }
    setEditedDay({ ...editedDay, warmup: newWarmup })
  }

  const handleAddWarmup = () => {
    setEditedDay({ ...editedDay, warmup: [...editedDay.warmup, { description: 'Nuevo calentamiento' }] })
  }

  const handleRemoveWarmup = (index: number) => {
    const newWarmup = [...editedDay.warmup]
    newWarmup.splice(index, 1)
    setEditedDay({ ...editedDay, warmup: newWarmup })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Rutina</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Nombre de la Rutina</Label>
            <Input 
              value={editedDay.name} 
              onChange={(e) => setEditedDay({ ...editedDay, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Calentamiento</Label>
              <Button type="button" variant="ghost" size="sm" onClick={handleAddWarmup}>
                <Plus className="h-4 w-4 mr-1" /> Añadir
              </Button>
            </div>
            {editedDay.warmup.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input 
                  value={item.description}
                  onChange={(e) => handleWarmupChange(idx, e.target.value)}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveWarmup(idx)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Ejercicios</Label>
              <Button type="button" variant="ghost" size="sm" onClick={handleAddExercise}>
                <Plus className="h-4 w-4 mr-1" /> Añadir
              </Button>
            </div>
            {editedDay.exercises.map((exercise, idx) => (
              <div key={exercise.id} className="p-3 border rounded-lg space-y-3 bg-secondary/20">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Nombre</Label>
                    <Input 
                      value={exercise.name} 
                      onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                    />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveExercise(idx)} className="text-destructive mt-5">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Series</Label>
                    <Input 
                      type="number" 
                      min="1"
                      value={exercise.sets} 
                      onChange={(e) => handleExerciseChange(idx, 'sets', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Repeticiones / Tiempo</Label>
                    <Input 
                      value={exercise.reps} 
                      onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => onSave(editedDay)}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
