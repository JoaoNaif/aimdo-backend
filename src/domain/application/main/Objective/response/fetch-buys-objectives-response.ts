import { Either } from '@/core/either'
import { DTOFetchObjectivesResponse } from '../dtos/dto-fetch-objectives-response'

export type FetchBuysObjectivesUseCaseResponse = Either<
  null,
  {
    buys: DTOFetchObjectivesResponse[]
  }
>
