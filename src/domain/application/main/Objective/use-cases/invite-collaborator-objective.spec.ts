import { InMemoryObjectiveRepository } from '../../../../../../test/repositories/in-memory-objective-repository'
import { makeObjective } from '../../../../../../test/factories/make-objective'
import { InMemoryUserRepository } from '../../../../../../test/repositories/in-memory-user-repository'
import { makeUser } from '../../../../../../test/factories/make-user'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { InviteCollaboratorObjectiveUseCase } from './invite-collaborator-objective'
import { InMemoryObjectiveInviteRepository } from '../../../../../../test/repositories/in-memory-objective-invite-repository'
import { makeObjectiveInvite } from '../../../../../../test/factories/make-objective-invite'
import { ObjectiveInviteAlreadyExistError } from '../errors/objective-invite-already-exist-error'
import { CollaboratorAlreadyAcceptInviteError } from '../errors/collaborator-already-accepted-invite-error'

let inMemoryObjectiveRepository: InMemoryObjectiveRepository
let inMemoryUserRepository: InMemoryUserRepository
let inMemoryObjectiveInviteRepository: InMemoryObjectiveInviteRepository
let sut: InviteCollaboratorObjectiveUseCase

describe('Invite Collaborator Objective', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryObjectiveRepository = new InMemoryObjectiveRepository()
    inMemoryObjectiveInviteRepository = new InMemoryObjectiveInviteRepository()
    sut = new InviteCollaboratorObjectiveUseCase(
      inMemoryObjectiveRepository,
      inMemoryUserRepository,
      inMemoryObjectiveInviteRepository
    )
  })

  it('should be able to delete a objective', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const collaborator = makeUser()

    await inMemoryUserRepository.create(collaborator)

    const objective = makeObjective({
      authorId: user.id,
    })

    await inMemoryObjectiveRepository.create(objective)

    const objectiveInvite = makeObjectiveInvite({
      objectiveId: objective.id,
      collaboratorId: collaborator.id,
      status: 'PENDING',
    })

    await inMemoryObjectiveInviteRepository.create(objectiveInvite)

    const result = await sut.execute({
      objectiveId: objective.id.toString(),
      authorId: user.id.toString(),
      collaboratorId: collaborator.id.toString(),
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ObjectiveInviteAlreadyExistError)
  })

  it('should be able to delete a objective', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const collaborator = makeUser()

    await inMemoryUserRepository.create(collaborator)

    const objective = makeObjective({
      authorId: user.id,
    })

    await inMemoryObjectiveRepository.create(objective)

    const result = await sut.execute({
      objectiveId: objective.id.toString(),
      authorId: user.id.toString(),
      collaboratorId: collaborator.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.invite).toEqual(
        expect.objectContaining({
          objectiveId: objective.id,
          collaboratorId: collaborator.id,
          status: 'PENDING',
        })
      )
    }
  })

  it('should be able to delete a objective if you are not the creator', async () => {
    const user = makeUser()

    await inMemoryUserRepository.create(user)

    const collaborator = makeUser()

    await inMemoryUserRepository.create(collaborator)

    const objective = makeObjective()

    await inMemoryObjectiveRepository.create(objective)

    const result = await sut.execute({
      objectiveId: objective.id.toString(),
      authorId: user.id.toString(),
      collaboratorId: collaborator.id.toString(),
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
