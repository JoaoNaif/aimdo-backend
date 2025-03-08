import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { ObjectiveFactory } from 'test/factories/make-objective'
import { ObjectiveInviteFactory } from 'test/factories/make-objective-invite'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'

describe('Fetch Objective Invite (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let objectiveFactory: ObjectiveFactory
  let objectiveInviteFactory: ObjectiveInviteFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ObjectiveFactory, ObjectiveInviteFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    objectiveFactory = moduleRef.get(ObjectiveFactory)
    objectiveInviteFactory = moduleRef.get(ObjectiveInviteFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /objectives/invites', async () => {
    const collaborator = await userFactory.makePrismaUser()

    const author = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: collaborator.id.toString() })

    const objective = await objectiveFactory.makePrismaObjective({
      authorId: author.id,
    })

    const objectiveInvite =
      await objectiveInviteFactory.makePrismaObjectiveInvite({
        collaboratorId: collaborator.id,
        objectiveId: objective.id,
      })

    const response = await request(app.getHttpServer())
      .get(`/objectives/invites`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      invites: expect.arrayContaining([
        expect.objectContaining({ id: objectiveInvite.id.toString() }),
      ]),
    })
  })
})
