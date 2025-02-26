import { DeleteObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/delete-objective'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/objective/:objectiveId')
export class DeleteObjectiveController {
  constructor(private deleteObjective: DeleteObjectiveUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('objectiveId') objectiveId: string,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub

    const result = await this.deleteObjective.execute({
      objectiveId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
