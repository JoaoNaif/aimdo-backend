import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { PasswordResetTokenFactory } from 'test/factories/make-password-reset-token'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'

describe('Reset Forgot Password (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let passwordResetTokenFactory: PasswordResetTokenFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PasswordResetTokenFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    passwordResetTokenFactory = moduleRef.get(PasswordResetTokenFactory)

    await app.init()
  })

  test('[POST] /reset-forgot-password', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@email.com',
      password: await hash('123456', 8),
    })

    const oldPassword = user.password

    const passwordResetToken =
      await passwordResetTokenFactory.makePrismaPasswordResetToken({
        userId: user.id,
      })

    const response = await request(app.getHttpServer())
      .post('/reset-forgot-password')
      .send({
        confirmPassword: 'test1234',
        password: 'test1234',
        email: user.email,
        token: passwordResetToken.token,
      })

    expect(response.statusCode).toBe(201)

    const newPassword = await prisma.user.findUnique({
      where: {
        id: user.id.toString(),
      },
    })

    if (newPassword) {
      expect(oldPassword).not.toEqual(newPassword.password)
    }
  })
})
