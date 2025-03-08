import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { NotificationFactory } from 'test/factories/make-notification'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'

describe('Fetch Notifications (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let notificationFactory: NotificationFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, NotificationFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    notificationFactory = moduleRef.get(NotificationFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /notifications', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      notificationFactory.makePrismaNotification({
        recipientId: user.id,
      }),
      notificationFactory.makePrismaNotification({
        recipientId: user.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/notifications`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      notifications: expect.arrayContaining([
        expect.objectContaining({ recipientId: user.id }),
        expect.objectContaining({ recipientId: user.id }),
      ]),
    })
  })
})
