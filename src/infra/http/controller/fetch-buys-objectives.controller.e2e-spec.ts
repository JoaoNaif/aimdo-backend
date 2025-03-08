import { INestApplication } from '@nestjs/common'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { ObjectiveFactory } from 'test/factories/make-objective'

describe('Fetch Buys (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let objectiveFactory: ObjectiveFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ObjectiveFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    objectiveFactory = moduleRef.get(ObjectiveFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /objectives/buys', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@email.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      objectiveFactory.makePrismaObjective({
        authorId: user.id,
        title: 'Title 1',
        category: 'BUY',
      }),
      objectiveFactory.makePrismaObjective({
        authorId: user.id,
        title: 'Title 2',
        category: 'BUY',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/objectives/buys`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      buys: expect.arrayContaining([
        expect.objectContaining({ title: 'Title 1', category: 'BUY' }),
        expect.objectContaining({ title: 'Title 2', category: 'BUY' }),
      ]),
    })
  })
})
