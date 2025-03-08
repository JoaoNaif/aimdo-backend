import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { PasswordResetTokenFactory } from 'test/factories/make-password-reset-token'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Forgot Password (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PasswordResetTokenFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /forgot-password', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@email.com',
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer())
      .post('/forgot-password')
      .send({
        email: 'johndoe@email.com',
      })

    expect(response.statusCode).toBe(201)

    const passwordResetTokenOnDatabase =
      await prisma.passwordResetToken.findFirst({
        where: {
          userId: user.id.toString(),
        },
      })

    expect(passwordResetTokenOnDatabase).toBeTruthy()
  })
})
