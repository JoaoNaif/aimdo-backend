import { INestApplication } from '@nestjs/common'
import { UserFactory } from 'test/factories/make-user'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { UserRepository } from '@/domain/application/main/_repositories/user-repository'

describe('Prisma User Repository (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let cacheRepository: CacheRepository
  let userRepository: UserRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    cacheRepository = moduleRef.get(CacheRepository)
    userRepository = moduleRef.get(UserRepository)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  it('should cache user details', async () => {
    const user = await userFactory.makePrismaUser({})

    const id = user.id.toValue()

    const userDetails = await userRepository.findById(id)

    const cached = await cacheRepository.get(`user:${id}:details`)

    expect(cached).toEqual(JSON.stringify(userDetails))
  })

  it('should return cached user details on subsequent calls', async () => {
    const user = await userFactory.makePrismaUser()

    const id = user.id.toValue()

    await cacheRepository.set(`user:${id}:details`, JSON.stringify(user))

    const userDetails = await userRepository.findById(id)

    expect(userDetails).toEqual(user)
  })

  it('should reset user details cache when saving the user', async () => {
    const user = await userFactory.makePrismaUser({})

    const id = user.id.toValue()

    await cacheRepository.set(
      `user:${id}:details`,
      JSON.stringify({ empty: true })
    )

    await userRepository.save(user)

    const cached = await cacheRepository.get(`user:${id}:details`)

    expect(cached).toBeNull()
  })
})
