import { Objective } from '@/domain/enterprise/entities/objective'

export class ObjectivePresenter {
  static toHTTP(objective: Objective) {
    return {
      id: objective.id.toString(),
      title: objective.title,
      description: objective.description,
      category: objective.category,
      status: objective.status,
      urgency: objective.urgency,
      authorId: objective.authorId.toString(),
      dueDate: objective.dueDate,
      completedDate: objective.completedDate,
      createdAt: objective.createdAt,
    }
  }
}
