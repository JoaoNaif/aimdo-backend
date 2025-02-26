import { INestApplication } from '@nestjs/common'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create Objective (E2E)', () => {
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

  test('[POST] /objective', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@email.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post(`/objective`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New Title',
        description: 'New Description',
        category: 'TASK',
        urgency: 'LOW',
        dueDate: null,
      })

    expect(response.statusCode).toBe(201)

    const objectiveOnDatabase = await prisma.objective.findFirst({
      where: {
        title: 'New Title',
      },
    })

    expect(objectiveOnDatabase).toBeTruthy()
  })
})
