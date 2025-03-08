import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface CreateObjectiveUseCaseRequest {
  title: string
  description: string
  authorId: string
  urgency: 'HIGH' | 'MEDIUM' | 'LOW'
  category: 'TASK' | 'BUY' | 'GOAL'
  dueDate?: Date | null
}
