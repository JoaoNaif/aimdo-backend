import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { ObjectiveInviteUpatedEvent } from '@/domain/enterprise/events/objective-invite-updated-event'
import { UserRepository } from '@/domain/application/main/_repositories/user-repository'
import { ObjectiveRepository } from '@/domain/application/main/_repositories/objective-repository'
import { DomainEvents } from '@/core/events/domain-events'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnObjectiveInviteUpdated implements EventHandler {
  constructor(
    private userRepository: UserRepository,
    private objectiveRepository: ObjectiveRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendUpdatedObjectiveInviteNotification.bind(this),
      ObjectiveInviteUpatedEvent.name
    )
  }

  private async sendUpdatedObjectiveInviteNotification({
    objectiveInvite,
  }: ObjectiveInviteUpatedEvent) {
    const objective = await this.objectiveRepository.findById(
      objectiveInvite.objectiveId.toString()
    )

    if (!objective) {
      return
    }

    const author = await this.userRepository.findById(
      objective.authorId.toString()
    )

    const collaborator = await this.userRepository.findById(
      objectiveInvite.collaboratorId.toString()
    )

    if (!author) {
      throw new Error('Not found Author')
    }

    if (!collaborator) {
      throw new Error('Not found Collaborator')
    }

    await this.sendNotification.execute({
      recipientId: author.id.toString(),
      title: `${collaborator.name} ${objectiveInvite.status === 'ACCEPTED' ? 'aceitou' : 'negou'} o convite`,
      content: `O convite foi ${objectiveInvite.status === 'ACCEPTED' ? 'aceito' : 'negado'} para o objetivo ${objective.title.substring(0, 40).concat('...')}`,
    })
  }
}
