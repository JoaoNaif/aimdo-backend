import { Either } from '@/core/either'
import { DTOFetchObjectivesResponse } from '../dtos/dto-fetch-objectives-response'

export type FetchTasksObjectivesUseCaseResponse = Either<
  null,
  {
    tasks: DTOFetchObjectivesResponse[]
  }
>
