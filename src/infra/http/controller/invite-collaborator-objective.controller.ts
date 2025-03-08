import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ObjectiveInviteAlreadyExistError } from '@/domain/application/main/Objective/errors/objective-invite-already-exist-error'
import { InviteCollaboratorObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/invite-collaborator-objective'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common'

@Controller('/objective/:objectiveId/invite/:collaboratorId')
export class InviteCollaboratorObjectiveController {
  constructor(
    private inviteCollaboratorObjective: InviteCollaboratorObjectiveUseCase
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Param('objectiveId') objectiveId: string,
    @Param('collaboratorId') collaboratorId: string,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub

    const result = await this.inviteCollaboratorObjective.execute({
      authorId: userId,
      collaboratorId,
      objectiveId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UnauthorizedError:
          throw new UnauthorizedException()
        case ObjectiveInviteAlreadyExistError:
          throw new ConflictException()
        default:
          throw new BadRequestException()
      }
    }
  }
}
