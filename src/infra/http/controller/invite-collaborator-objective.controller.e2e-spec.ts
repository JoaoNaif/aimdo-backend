import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { ObjectiveFactory } from 'test/factories/make-objective'

describe('Invite Collaborator (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let objectiveFactory: ObjectiveFactory
  let jwt: JwtService
  let prisma: PrismaService

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

    await app.init()
  })

  test('[POST] /objective/:objectiveId/invite/:collaboratorId', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@email.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const collaborator = await userFactory.makePrismaUser({
      email: 'collaborator@email.com',
      password: await hash('123456', 8),
    })

    const objective = await objectiveFactory.makePrismaObjective({
      authorId: user.id,
    })

    const response = await request(app.getHttpServer())
      .post(
        `/objective/${objective.id.toString()}/invite/${collaborator.id.toString()}`
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(201)

    const objectiveOnDatabase = await prisma.objectiveInvite.findFirst({
      where: {
        status: 'PENDING',
      },
    })

    expect(objectiveOnDatabase).toBeTruthy()
  })
})
