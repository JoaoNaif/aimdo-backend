import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { Injectable } from '@nestjs/common'
import { NotificationRepository } from '../repositories/notification-repository'

export interface FetchNotificationsUseCaseRequest {
  recipientId: string
}

export type FetchNotificationsUseCaseResponse = Either<
  null,
  {
    notifications: Notification[]
  }
>

@Injectable()
export class FetchNotificationsUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    recipientId,
  }: FetchNotificationsUseCaseRequest): Promise<FetchNotificationsUseCaseResponse> {
    const notifications =
      await this.notificationRepository.findManyNotifications(recipientId)

    return right({
      notifications,
    })
  }
}
