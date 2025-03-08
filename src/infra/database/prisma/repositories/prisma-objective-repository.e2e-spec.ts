import { INestApplication } from '@nestjs/common'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { makeObjective, ObjectiveFactory } from 'test/factories/make-objective'
import { ObjectiveRepository } from '@/domain/application/main/_repositories/objective-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Prisma Objective Repository (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let objectiveFactory: ObjectiveFactory
  let cacheRepository: CacheRepository
  let objectiveRepository: ObjectiveRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [UserFactory, ObjectiveFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    cacheRepository = moduleRef.get(CacheRepository)
    userFactory = moduleRef.get(UserFactory)
    objectiveFactory = moduleRef.get(ObjectiveFactory)
    objectiveRepository = moduleRef.get(ObjectiveRepository)

    await app.init()
  })

  it('should cache objectives details', async () => {
    const user = await userFactory.makePrismaUser({})

    const objective = await await Promise.all([
      objectiveFactory.makePrismaObjective({
        authorId: user.id,
        category: 'TASK',
      }),
      objectiveFactory.makePrismaObjective({
        authorId: user.id,
        category: 'BUY',
      }),
      objectiveFactory.makePrismaObjective({
        authorId: user.id,
        category: 'GOAL',
      }),
    ])

    const authorId = user.id.toString()
    const page = 1

    const objectivesTask = await objectiveRepository.findManyTasks(authorId, {
      page,
    })

    const cachedTask = await cacheRepository.get(
      `objectives:authorId:${authorId}:category:TASK:page:${page}`
    )

    expect(cachedTask).toEqual(JSON.stringify(objectivesTask))

    const objectivesGoal = await objectiveRepository.findManyGoals(authorId, {
      page,
    })

    const cachedGoal = await cacheRepository.get(
      `objectives:authorId:${authorId}:category:GOAL:page:${page}`
    )

    expect(cachedGoal).toEqual(JSON.stringify(objectivesGoal))

    const objectivesBuy = await objectiveRepository.findManyBuys(authorId, {
      page,
    })

    const cachedBuy = await cacheRepository.get(
      `objectives:authorId:${authorId}:category:BUY:page:${page}`
    )

    expect(cachedBuy).toEqual(JSON.stringify(objectivesBuy))
  })

  it('should return cached objectives details on subsequent calls', async () => {
    const user = await userFactory.makePrismaUser({})

    await Promise.all([
      objectiveFactory.makePrismaObjective({
        authorId: user.id,
        category: 'TASK',
      }),
      objectiveFactory.makePrismaObjective({
        authorId: user.id,
        category: 'GOAL',
      }),
      objectiveFactory.makePrismaObjective({
        authorId: user.id,
        category: 'BUY',
      }),
    ])

    const authorId = user.id.toString()
    const page = 1

    await Promise.all([
      cacheRepository.set(
        `objectives:authorId:${authorId}:category:TASK:page:${page}`,
        JSON.stringify({ empty: true })
      ),
      cacheRepository.set(
        `objectives:authorId:${authorId}:category:GOAL:page:${page}`,
        JSON.stringify({ empty: true })
      ),
      cacheRepository.set(
        `objectives:authorId:${authorId}:category:BUY:page:${page}`,
        JSON.stringify({ empty: true })
      ),
    ])

    const task = await objectiveRepository.findManyTasks(authorId, {
      page,
    })

    const goal = await objectiveRepository.findManyGoals(authorId, {
      page,
    })

    const buys = await objectiveRepository.findManyBuys(authorId, {
      page,
    })

    expect(task).toEqual({ empty: true })
    expect(goal).toEqual({ empty: true })
    expect(buys).toEqual({ empty: true })
  })

  it('should reset objectives cache when saving the objectives (METHOD SAVE)', async () => {
    const user = await userFactory.makePrismaUser({})

    const task = await objectiveFactory.makePrismaObjective({
      authorId: user.id,
      category: 'TASK',
    })

    const authorId = user.id.toString()
    const page = 1

    await Promise.all([
      cacheRepository.set(
        `objectives:authorId:${authorId}:category:TASK:page:${page}`,
        JSON.stringify({ empty: true })
      ),
      cacheRepository.set(
        `objectives:authorId:${authorId}:category:GOAL:page:${page}`,
        JSON.stringify({ empty: true })
      ),
      cacheRepository.set(
        `objectives:authorId:${authorId}:category:BUY:page:${page}`,
        JSON.stringify({ empty: true })
      ),
    ])

    await objectiveRepository.save(task)

    const cachedTask = await cacheRepository.get(
      `objectives:authorId:${authorId}:category:${task.category}:page:${page}`
    )

    expect(cachedTask).toBeNull()

    const goal = await objectiveFactory.makePrismaObjective({
      authorId: user.id,
      category: 'GOAL',
    })

    await objectiveRepository.save(goal)

    const cachedGoal = await cacheRepository.get(
      `objectives:authorId:${authorId}:category:${goal.category}:page:${page}`
    )

    expect(cachedGoal).toBeNull()

    const buy = await objectiveFactory.makePrismaObjective({
      authorId: user.id,
      category: 'BUY',
    })

    await objectiveRepository.save(buy)

    const cachedBuy = await cacheRepository.get(
      `objectives:authorId:${authorId}:category:${buy.category}:page:${page}`
    )

    expect(cachedBuy).toBeNull()
  })

  it('should reset objectives cache when saving the objectives (METHOD CREATE)', async () => {
    const user = await userFactory.makePrismaUser({})

    const task = await objectiveFactory.makePrismaObjective({
      authorId: user.id,
      category: 'TASK',
    })

    const authorId = user.id.toString()
    const page = 1

    await Promise.all([
      cacheRepository.set(
        `objectives:authorId:${authorId}:category:TASK:page:${page}`,
        JSON.stringify({ empty: true })
      ),
      cacheRepository.set(
        `objectives:authorId:${authorId}:category:GOAL:page:${page}`,
        JSON.stringify({ empty: true })
      ),
      cacheRepository.set(
        `objectives:authorId:${authorId}:category:BUY:page:${page}`,
        JSON.stringify({ empty: true })
      ),
    ])

    await objectiveRepository.create(
      makeObjective(
        { authorId: user.id, category: 'TASK' },
        new UniqueEntityId('user-test-task')
      )
    )

    const cachedTask = await cacheRepository.get(
      `objectives:authorId:${authorId}:category:${task.category}:page:${page}`
    )

    expect(cachedTask).toBeNull()

    const goal = await objectiveFactory.makePrismaObjective({
      authorId: user.id,
      category: 'GOAL',
    })

    await objectiveRepository.create(
      makeObjective(
        { authorId: user.id, category: 'GOAL' },
        new UniqueEntityId('user-test-goal')
      )
    )

    const cachedGoal = await cacheRepository.get(
      `objectives:authorId:${authorId}:category:${goal.category}:page:${page}`
    )

    expect(cachedGoal).toBeNull()

    const buy = await objectiveFactory.makePrismaObjective({
      authorId: user.id,
      category: 'BUY',
    })

    await objectiveRepository.create(
      makeObjective(
        { authorId: user.id, category: 'BUY' },
        new UniqueEntityId('user-test-buy')
      )
    )

    const cachedBuy = await cacheRepository.get(
      `objectives:authorId:${authorId}:category:${buy.category}:page:${page}`
    )

    expect(cachedBuy).toBeNull()
  })
})
