import { PaginationParams } from '@/core/repository/pagination-params'
import { Objective } from '@/domain/enterprise/entities/objective'
import { User } from '@/domain/enterprise/entities/user'

export abstract class ObjectiveRepository {
  abstract findById(id: string): Promise<Objective | null>
  abstract findManyObjectives(
    authorId: string,
    params: PaginationParams
  ): Promise<Objective[]>
  abstract findManyCollaborators(
    objectiveId: string,
    params: PaginationParams
  ): Promise<User[]>
  abstract deleteCollaborator(
    objectiveId: string,
    collaboratorId: string
  ): Promise<void>
  abstract findManyTasks(
    authorId: string,
    parmas: PaginationParams
  ): Promise<Objective[]>
  abstract findManyGoals(
    authorId: string,
    parmas: PaginationParams
  ): Promise<Objective[]>
  abstract findManyBuys(
    authorId: string,
    parmas: PaginationParams
  ): Promise<Objective[]>
  abstract create(objective: Objective): Promise<void>
  abstract save(objective: Objective): Promise<void>
  abstract delete(objective: Objective): Promise<void>
}
