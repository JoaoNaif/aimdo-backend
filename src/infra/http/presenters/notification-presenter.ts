import { Notification } from '@/domain/application/notification/enterprise/entities/notification'

export class NotificationPresenter {
  static toHTTP(notification: Notification) {
    return {
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      recipientId: notification.recipientId,
    }
  }
}
