import { PaginationParams } from '@/core/repository/pagination-params'
import { ObjectiveRepository } from '@/domain/application/main/_repositories/objective-repository'
import { Objective } from '@/domain/enterprise/entities/objective'
import { User } from '@/domain/enterprise/entities/user'

export class InMemoryObjectiveRepository implements ObjectiveRepository {
  public items: Objective[] = []

  async findById(id: string): Promise<Objective | null> {
    const objective = this.items.find((item) => item.id.toString() === id)

    if (!objective) {
      return null
    }

    return objective
  }

  async findManyObjectives(
    userId: string,
    { page }: PaginationParams
  ): Promise<Objective[]> {
    const objectives = this.items
      .filter((obj) => obj.authorId.toString() === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return objectives
  }

  async findManyCollaborators(
    objectiveId: string,
    { page }: PaginationParams
  ): Promise<User[]> {
    const objective = this.items.find(
      (item) => item.id.toString() === objectiveId
    )

    if (!objective) {
      return []
    }

    const collaboratorsPagination = objective.collaborators
      .sort()
      .slice((page - 1) * 20, page * 20)

    return collaboratorsPagination
  }

  async deleteCollaborator(
    objectiveId: string,
    collaboratorId: string
  ): Promise<void> {
    const objective = this.items.find(
      (item) => item.id.toString() === objectiveId
    )

    if (!objective) {
      return
    }

    objective.collaborators = objective.collaborators.filter(
      (collaborator) => collaborator.id.toString() !== collaboratorId
    )
  }

  async findManyTasks(
    authorId: string,
    { page }: PaginationParams
  ): Promise<Objective[]> {
    const tasks = this.items
      .filter(
        (obj) => obj.authorId.toString() === authorId && obj.category === 'TASK'
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return tasks
  }

  async findManyGoals(
    authorId: string,
    { page }: PaginationParams
  ): Promise<Objective[]> {
    const goals = this.items
      .filter(
        (obj) => obj.authorId.toString() === authorId && obj.category === 'GOAL'
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return goals
  }

  async findManyBuys(
    authorId: string,
    { page }: PaginationParams
  ): Promise<Objective[]> {
    const buys = this.items
      .filter(
        (obj) => obj.authorId.toString() === authorId && obj.category === 'BUY'
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return buys
  }

  async create(objective: Objective): Promise<void> {
    this.items.push(objective)
  }

  async save(objective: Objective): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === objective.id)

    this.items[itemIndex] = objective
  }

  async delete(objective: Objective): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === objective.id)

    this.items.splice(itemIndex, 1)
  }
}
