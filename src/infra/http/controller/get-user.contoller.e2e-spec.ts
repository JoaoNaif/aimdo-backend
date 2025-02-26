import { INestApplication } from '@nestjs/common'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'

describe('Get User (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /user', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@email.com',
      password: await hash('123456', 8),
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/user`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.body).toEqual({
      user: expect.objectContaining({}),
    })
  })
})
