import { UserRepository } from '@/domain/application/main/_repositories/user-repository'
import { User } from '@/domain/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository
  ) {}

  async findById(id: string): Promise<User | null> {
    const cacheKey = `user:${id}:details`
    const cacheHit = await this.cache.get(cacheKey)

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit)

      return User.create(
        {
          name: cacheData.props.name,
          username: cacheData.props.username,
          email: cacheData.props.email,
          password: cacheData.props.password,
          createdAt: new Date(cacheData.props.createdAt),
        },
        new UniqueEntityId(cacheData._id.value)
      )
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    const userDetails = PrismaUserMapper.toDomain(user)

    await this.cache.set(cacheKey, JSON.stringify(userDetails))

    return userDetails
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.create({
      data,
    })
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await Promise.all([
      this.prisma.user.update({
        where: {
          id: data.id,
        },
        data,
      }),

      this.cache.delete(`user:${data.id?.toString()}:details`),
    ])
  }

  async delete(user: User): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: user.id.toString(),
      },
    })
  }
}
