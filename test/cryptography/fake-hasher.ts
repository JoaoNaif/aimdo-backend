import { HashGenerator } from '@/domain/application/main/_cryptography/hash-generator'
import { HashCompare } from '@/domain/application/main/_cryptography/hash-compare'

export class FakeHasher implements HashGenerator, HashCompare {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
