import { FetchNotificationsUseCase } from '@/domain/application/notification/application/use-cases/fetch-notifications'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { BadRequestException, Controller, Get } from '@nestjs/common'
import { NotificationPresenter } from '../presenters/notification-presenter'

@Controller('/notifications')
export class FetchNotificationsController {
  constructor(private fetchNotifications: FetchNotificationsUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const recipientId = user.sub

    const result = await this.fetchNotifications.execute({
      recipientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const notifications = result.value.notifications

    return { notifications: notifications.map(NotificationPresenter.toHTTP) }
  }
}
