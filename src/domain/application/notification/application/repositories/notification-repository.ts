import { Notification } from '../../enterprise/entities/notification'

export abstract class NotificationRepository {
  abstract findById(id: string): Promise<Notification | null>
  abstract findManyNotifications(recipientId: string): Promise<Notification[]>
  abstract create(notification: Notification): Promise<void>
  abstract save(notification: Notification): Promise<void>
}
