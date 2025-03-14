import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/application/notification/enterprise/entities/notification'
import { Prisma, Notification as PrismaNotification } from '@prisma/client'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        recipientId: new UniqueEntityId(raw.recipientId),
        title: raw.title,
        content: raw.content,
        createdAt: raw.createdAt,
        readAt: raw.readAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    notification: Notification
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      content: notification.content,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    }
  }
}
