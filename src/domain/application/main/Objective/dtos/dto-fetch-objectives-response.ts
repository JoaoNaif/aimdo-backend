import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface DTOFetchObjectivesResponse {
  id: UniqueEntityId
  title: string
  urgency: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'
  category: 'TASK' | 'BUY' | 'GOAL'
  dueDate: Date | null | undefined
  createdAt: Date
}
