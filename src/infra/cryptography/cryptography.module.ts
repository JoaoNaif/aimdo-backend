import { Encrypter } from '@/domain/application/main/_cryptography/encrypter'
import { Module } from '@nestjs/common'
import { JwtEncrypter } from './jwt.encrypter'
import { HashCompare } from '@/domain/application/main/_cryptography/hash-compare'
import { BcryptHasher } from './bcrypt-hasher'
import { HashGenerator } from '@/domain/application/main/_cryptography/hash-generator'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashCompare, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashCompare, HashGenerator],
})
export class CryptographyModule {}
