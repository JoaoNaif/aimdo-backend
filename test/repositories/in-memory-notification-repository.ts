import { NotificationRepository } from '@/domain/application/notification/application/repositories/notification-repository'
import { Notification } from '@/domain/application/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository implements NotificationRepository {
  public items: Notification[] = []

  async findById(id: string) {
    const notification = this.items.find((item) => item.id.toString() === id)

    if (!notification) {
      return null
    }

    return notification
  }

  async findManyNotifications(recipientId: string): Promise<Notification[]> {
    const notifications = this.items
      .filter(
        (notification) =>
          notification.recipientId.toString() === recipientId &&
          !notification.readAt
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return notifications
  }

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(notification: Notification) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === notification.id
    )

    this.items[itemIndex] = notification
  }
}
