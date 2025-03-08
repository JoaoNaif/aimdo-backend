import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { UncanceledStatusObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/uncanceled-status-objective'
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

@Controller('/objective/uncanceled-status/:objectiveId')
export class UncanceledStatusObjectiveController {
  constructor(
    private uncanceledStatusObjective: UncanceledStatusObjectiveUseCase
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('objectiveId') objectiveId: string,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub

    const result = await this.uncanceledStatusObjective.execute({
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
