import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Objective } from '@/domain/enterprise/entities/objective'

export type GetObjectiveUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    objective: Objective
  }
>
