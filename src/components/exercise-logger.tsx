import { useState } from 'react'
import { Exercise, LoggedSet } from '@/lib/gym-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Check } from 'lucide-react'

interface ExerciseLoggerProps {
  exercise: Exercise
  exerciseNumber: number
  loggedSets: LoggedSet[]
  onUpdateSets: (sets: LoggedSet[]) => void
}

export function ExerciseLogger({ 
  exercise, 
  exerciseNumber, 
  loggedSets, 
  onUpdateSets 
}: ExerciseLoggerProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const addSet = () => {
    const lastSet = loggedSets[loggedSets.length - 1]
    const newSet: LoggedSet = {
      setNumber: loggedSets.length + 1,
      weight: lastSet?.weight || 0,
      weightUnit: lastSet?.weightUnit || 'kg',
      reps: lastSet?.reps || 10,
      duration: exercise.isTimeBased ? (lastSet?.duration || exercise.reps) : undefined
    }
    onUpdateSets([...loggedSets, newSet])
  }

  const updateSet = (index: number, updates: Partial<LoggedSet>) => {
    const newSets = [...loggedSets]
    newSets[index] = { ...newSets[index], ...updates }
    onUpdateSets(newSets)
  }

  const removeSet = (index: number) => {
    const newSets = loggedSets.filter((_, i) => i !== index)
      .map((set, i) => ({ ...set, setNumber: i + 1 }))
    onUpdateSets(newSets)
  }

  const toggleUnit = (index: number) => {
    const currentUnit = loggedSets[index].weightUnit || 'kg'
    updateSet(index, { weightUnit: currentUnit === 'kg' ? 'lbs' : 'kg' })
  }

  const isComplete = loggedSets.length >= exercise.sets

  return (
    <Card className={`border-border/50 transition-all ${isComplete ? 'border-primary/30 bg-primary/5' : ''}`}>
      <CardHeader 
        className="pb-2 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
              isComplete 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-foreground'
            }`}>
              {isComplete ? <Check className="h-4 w-4" /> : exerciseNumber}
            </span>
            <div>
              <CardTitle className="text-base">{exercise.name}</CardTitle>
              <p className="text-xs text-muted-foreground">
                Objetivo: {exercise.sets} x {exercise.reps}
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {loggedSets.length}/{exercise.sets} series
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-2">
          <div className="space-y-2">
            {loggedSets.map((set, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 py-2 px-3 rounded-lg bg-secondary/30"
              >
                <span className="w-8 text-sm font-medium text-muted-foreground">
                  {set.setNumber}.
                </span>
                
                {exercise.isTimeBased ? (
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={set.duration || ''}
                      onChange={(e) => updateSet(index, { duration: e.target.value })}
                      placeholder="40s"
                      className="h-8 text-center"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-1 flex-1">
                      <Input
                        type="number"
                        value={set.weight || ''}
                        onChange={(e) => updateSet(index, { weight: parseFloat(e.target.value) || 0 })}
                        placeholder="Peso"
                        className="h-8 w-20 text-center"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleUnit(index)
                        }}
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        {set.weightUnit || 'kg'}
                      </Button>
                    </div>
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="number"
                      value={set.reps || ''}
                      onChange={(e) => updateSet(index, { reps: parseInt(e.target.value) || 0 })}
                      placeholder="Reps"
                      className="h-8 w-16 text-center"
                    />
                  </>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSet(index)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={addSet}
              className="w-full gap-2 border-dashed"
            >
              <Plus className="h-4 w-4" />
              Agregar serie
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
