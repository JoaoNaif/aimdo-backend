import { Either } from '@/core/either'
import { Invites } from '@/domain/enterprise/entities/value-objects/invites'

export type FetchObjectiveInviteUseCaseResponse = Either<
  null,
  {
    invites: Invites[]
  }
>
