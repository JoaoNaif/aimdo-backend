import { Either } from '@/core/either'
import { DTOFetchObjectivesResponse } from '../dtos/dto-fetch-objectives-response'
import { Objective } from '@/domain/enterprise/entities/objective'

export type FetchTasksObjectivesUseCaseResponse = Either<
  null,
  {
    tasks: DTOFetchObjectivesResponse[]
  }
>
