import { ObjectiveInvite } from '@/domain/enterprise/entities/objective-invite'
import { Invites } from '@/domain/enterprise/entities/value-objects/invites'

export abstract class ObjectiveInviteRepository {
  abstract findById(id: string): Promise<ObjectiveInvite | null>
  abstract findPendingInvite(
    objectiveId: string,
    collaboratorId: string
  ): Promise<ObjectiveInvite | null>
  abstract findManyInvites(collaboratorId: string): Promise<Invites[]>
  abstract create(objectiveInvite: ObjectiveInvite): Promise<void>
  abstract save(objectiveInvite: ObjectiveInvite): Promise<void>
  abstract delete(objectiveInvite: ObjectiveInvite): Promise<void>
}
