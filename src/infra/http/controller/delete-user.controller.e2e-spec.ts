import { INestApplication } from '@nestjs/common'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Delete User (E2E)', () => {
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

  test('[DELETE] /user/:userId', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@email.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/user/${user.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id.toString(),
      },
    })

    expect(userOnDatabase).toBeNull()
  })
})
