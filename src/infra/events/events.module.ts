import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnObjectiveInviteCreated } from '@/domain/application/notification/application/subscribers/on-objective-invite-created'
import { OnObjectiveInviteUpdated } from '@/domain/application/notification/application/subscribers/on-objective-invite-updated'
import { SendNotificationUseCase } from '@/domain/application/notification/application/use-cases/send-notification'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnObjectiveInviteCreated,
    OnObjectiveInviteUpdated,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
