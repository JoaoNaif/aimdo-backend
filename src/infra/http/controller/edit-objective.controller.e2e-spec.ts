import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { ObjectiveFactory } from 'test/factories/make-objective'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Put Objective (E2E)', () => {
  let app: INestApplication
  let objectiveFactory: ObjectiveFactory
  let userFactory: UserFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ObjectiveFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    objectiveFactory = moduleRef.get(ObjectiveFactory)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /objective/:objectiveId', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const objective = await objectiveFactory.makePrismaObjective({
      authorId: user.id,
    })

    const response = await request(app.getHttpServer())
      .put(`/objective/${objective.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Editado',
        description: 'editar teste',
      })

    expect(response.statusCode).toBe(204)

    const objectiveOnDatabase = await prisma.objective.findFirst({
      where: {
        title: 'Editado',
      },
    })

    expect(objectiveOnDatabase).toBeTruthy()
  })
})
