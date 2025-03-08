import { RemoveCollaboratorObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/remove-collaborator-objective'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'

@Controller('/objective/:objectiveId/remove/:collaboratorId')
export class RemoveCollaboratorObjectiveController {
  constructor(
    private removeCollaboratorObjective: RemoveCollaboratorObjectiveUseCase
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('objectiveId') objectiveId: string,
    @Param('collaboratorId') collaboratorId: string,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub

    const result = await this.removeCollaboratorObjective.execute({
      authorId: userId,
      collaboratorId,
      objectiveId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
