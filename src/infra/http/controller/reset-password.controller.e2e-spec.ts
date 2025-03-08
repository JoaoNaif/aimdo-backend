import { INestApplication } from '@nestjs/common'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { compare, hash } from 'bcryptjs'
import request from 'supertest'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Reset Password (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /user/password-reset', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const userId = user.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/user/password-reset`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        oldPassword: '123456',
        newPassword: 'admin123',
        confirmNewPassword: 'admin123',
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id.toString(),
      },
    })

    if (userOnDatabase) {
      const compareNewPassword = await compare(
        'admin123',
        userOnDatabase.password
      )

      expect(compareNewPassword).toEqual(true)
    }
  })
})
