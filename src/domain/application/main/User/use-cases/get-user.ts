import { left, right } from '@/core/either'
import { UserRepository } from '../../_repositories/user-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GetUserUseCaseRequest } from '../request/get-user-request'
import { GetUserUseCaseResponse } from '../response/get-user-response'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const userDto: DTOGetUserResponse = {
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
      createdAt: user.createdAt,
    }

    return right({
      user: userDto,
    })
  }
}
