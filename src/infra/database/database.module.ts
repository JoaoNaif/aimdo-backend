import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ObjectiveRepository } from '@/domain/application/main/_repositories/objective-repository'
import { PrismaObjectiveRepository } from './prisma/repositories/prisma-objective-repository'
import { UserRepository } from '@/domain/application/main/_repositories/user-repository'
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository'
import { ObjectiveInviteRepository } from '@/domain/application/main/_repositories/objective-invite-repository'
import { PrismaObjectiveInviteRepository } from './prisma/repositories/prisma-objective-invite-repository'
import { NotificationRepository } from '@/domain/application/notification/application/repositories/notification-repository'
import { PrismaNotificationRepository } from './prisma/repositories/prisma-notification-repository'
import { CacheModule } from '../cache/cache.module'
import { PasswordResetTokenRepository } from '@/domain/application/main/_repositories/password-reset-token-repository'
import { PrismaPasswordResetTokenRepository } from './prisma/repositories/prisma-password-reset-token-respository'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    { provide: ObjectiveRepository, useClass: PrismaObjectiveRepository },
    { provide: UserRepository, useClass: PrismaUserRepository },
    {
      provide: ObjectiveInviteRepository,
      useClass: PrismaObjectiveInviteRepository,
    },
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationRepository,
    },
    {
      provide: PasswordResetTokenRepository,
      useClass: PrismaPasswordResetTokenRepository,
    },
  ],
  exports: [
    PrismaService,
    ObjectiveRepository,
    UserRepository,
    ObjectiveInviteRepository,
    NotificationRepository,
    PasswordResetTokenRepository,
  ],
})
export class DatabaseModule {}
