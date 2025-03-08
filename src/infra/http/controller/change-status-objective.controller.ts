import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { ChangeStatusObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/change-status-objective'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common'

@Controller('/objective/change-status/:objectiveId')
export class ChangeStatusObjectiveController {
  constructor(private changeStatusObjective: ChangeStatusObjectiveUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('objectiveId') objectiveId: string,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub

    const result = await this.changeStatusObjective.execute({
      authorId: userId,
      objectiveId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UnauthorizedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
