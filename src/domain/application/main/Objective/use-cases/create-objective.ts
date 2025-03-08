import { left, right } from '@/core/either'
import { UserRepository } from '../../_repositories/user-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CreateObjectiveUseCaseResponse } from '../response/create-objective-response'
import { CreateObjectiveUseCaseRequest } from '../request/create-objective-request'
import { Objective } from '@/domain/enterprise/entities/objective'
import { ObjectiveRepository } from '../../_repositories/objective-repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateObjectiveUseCase {
  constructor(
    private objectiveRepository: ObjectiveRepository,
    private userRepository: UserRepository
  ) {}

  async execute({
    authorId,
    category,
    description,
    title,
    urgency,
    dueDate,
  }: CreateObjectiveUseCaseRequest): Promise<CreateObjectiveUseCaseResponse> {
    const user = await this.userRepository.findById(authorId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const objective = Objective.create({
      authorId: user.id,
      title,
      description,
      category,
      urgency,
      dueDate,
    })

    await this.objectiveRepository.create(objective)

    return right({
      objective,
    })
  }
}
