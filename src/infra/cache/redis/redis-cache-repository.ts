import { Injectable } from '@nestjs/common'
import { CacheRepository } from '../cache-repository'
import { RedisService } from './redis.service'

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', 60 * 15) // expirando em 15 minutos
  }

  get(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async scan(pattern: string): Promise<string[]> {
    let cursor = '0'
    let allKeys: string[] = []

    do {
      // O comando scan retorna um array onde o primeiro elemento é o próximo cursor
      // e o segundo elemento é um array de chaves que correspondem ao padrão
      const [nextCursor, keys] = await this.redis.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100
      )

      cursor = nextCursor
      allKeys = allKeys.concat(keys)
    } while (cursor !== '0')

    return allKeys
  }

  async deleteMany(pattern: string): Promise<void> {
    const keys = await this.scan(pattern)

    if (keys.length > 0) {
      await this.redis.del(keys)
    }
  }
}
