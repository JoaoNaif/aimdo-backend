import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DTOFetchObjectivesResponse } from '../dtos/dto-fetch-objectives-response'

export type FetchObjectivesUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    objectives: DTOFetchObjectivesResponse[]
  }
>
