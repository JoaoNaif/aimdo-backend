import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { CanceledStatusObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/canceled-status-objective'
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

@Controller('/objective/canceled-status/:objectiveId')
export class CanceledStatusObjectiveController {
  constructor(
    private canceledStatusObjective: CanceledStatusObjectiveUseCase
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('objectiveId') objectiveId: string,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub

    const result = await this.canceledStatusObjective.execute({
      authorId: userId,
      objectiveId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UnauthorizedError:
          throw new UnauthorizedException()
        default:
          throw new BadRequestException()
      }
    }
  }
}
