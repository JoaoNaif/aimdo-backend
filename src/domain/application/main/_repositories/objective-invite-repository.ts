import { ObjectiveInvite } from '@/domain/enterprise/entities/objective-invite'

export abstract class ObjectiveInviteRepository {
  abstract findById(id: string): Promise<ObjectiveInvite | null>
  abstract findPendingInvite(
    objectiveId: string,
    collaboratorId: string
  ): Promise<ObjectiveInvite | null>
  abstract create(objectiveInvite: ObjectiveInvite): Promise<void>
  abstract save(objectiveInvite: ObjectiveInvite): Promise<void>
  abstract delete(objectiveInvite: ObjectiveInvite): Promise<void>
}
