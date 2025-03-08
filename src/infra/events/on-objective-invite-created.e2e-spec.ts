import { INestApplication } from '@nestjs/common'
import { PrismaService } from '../database/prisma/prisma.service'
import { UserFactory } from 'test/factories/make-user'
import { ObjectiveFactory } from 'test/factories/make-objective'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from '../app.module'
import { DatabaseModule } from '../database/database.module'
import { DomainEvents } from '@/core/events/domain-events'
import request from 'supertest'

describe('On Objective Invite Created', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let objectiveFactory: ObjectiveFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ObjectiveFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    objectiveFactory = moduleRef.get(ObjectiveFactory)
    jwt = moduleRef.get(JwtService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when invite is created', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@email.com',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const collaborator = await userFactory.makePrismaUser({
      email: 'collaborator@email.com',
    })

    const objective = await objectiveFactory.makePrismaObjective({
      authorId: user.id,
    })

    await request(app.getHttpServer())
      .post(
        `/objective/${objective.id.toString()}/invite/${collaborator.id.toString()}`
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    await vi.waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: collaborator.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
