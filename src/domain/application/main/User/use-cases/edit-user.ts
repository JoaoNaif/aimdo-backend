import { left, right } from '@/core/either'
import { UserRepository } from '../../_repositories/user-repository'
import { EmailAlreadyExistError } from '../errors/user-email-already-exist-error'
import { UsernameAlreadyExistError } from '../errors/user-username-already.exist'
import { EditUserUseCaseResponse } from '../response/edit-user-response'
import { EditUserUseCaseRequest } from '../request/edit-user-request'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EditUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
    name,
    email,
    username,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (email) {
      const userWithSameEmail = await this.userRepository.findByEmail(email)

      if (userWithSameEmail) {
        return left(new EmailAlreadyExistError())
      }
    }

    if (username) {
      const userWithSameUsername =
        await this.userRepository.findByUsername(username)

      if (userWithSameUsername) {
        return left(new UsernameAlreadyExistError())
      }
    }

    user.email = email ?? user.email
    user.username = username ?? user.username
    user.name = name ?? user.name

    await this.userRepository.save(user)

    return right(null)
  }
}
