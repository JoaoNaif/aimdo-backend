export interface EditObjectiveUseCaseRequest {
  objectiveId: string
  authorId: string
  title?: string
  description?: string
  urgency?: 'HIGH' | 'MEDIUM' | 'LOW'
  category?: 'TASK' | 'BUY' | 'GOAL'
}
