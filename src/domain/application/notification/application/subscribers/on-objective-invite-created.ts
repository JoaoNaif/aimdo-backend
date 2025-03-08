import { EventHandler } from '@/core/events/event-handler'
import { ObjectiveRepository } from '@/domain/application/main/_repositories/objective-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { ObjectiveInviteCreatedEvent } from '@/domain/enterprise/events/objective-invite-created-event'
import { UserRepository } from '@/domain/application/main/_repositories/user-repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnObjectiveInviteCreated implements EventHandler {
  constructor(
    private userRepository: UserRepository,
    private objectiveRepository: ObjectiveRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewObjectiveInviteNotification.bind(this),
      ObjectiveInviteCreatedEvent.name
    )
  }

  private async sendNewObjectiveInviteNotification({
    objectiveInvite,
  }: ObjectiveInviteCreatedEvent) {
    const collaborator = await this.userRepository.findById(
      objectiveInvite.collaboratorId.toString()
    )

    const objective = await this.objectiveRepository.findById(
      objectiveInvite.objectiveId.toString()
    )

    if (!objective) {
      throw new Error('objective')
    }

    const user = await this.userRepository.findById(
      objective.authorId.toString()
    )

    if (!user) {
      throw new Error('Not found user')
    }

    if (!collaborator) {
      throw new Error('Not found collaborator')
    }

    await this.sendNotification.execute({
      recipientId: collaborator.id.toString(),
      title: `Novo convite de ${user.name.substring(0, 40).concat('...')}`,
      content: `Você foi convidado a participar do objetivo "${objective.title
        .substring(0, 120)
        .concat('...')}"`,
    })
  }
}
