import { DeclineObjectiveInviteUseCase } from '@/domain/application/main/Objective/use-cases/decline-objective-invite'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'

@Controller('/objective/:inviteId/to/:collaboratorId')
export class DeclineObjectiveInviteController {
  constructor(private declineObjectiveInvite: DeclineObjectiveInviteUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('inviteId') objectiveInviteId: string,
    @Param('collaboratorId') userId: string
  ) {
    const result = await this.declineObjectiveInvite.execute({
      objectiveInviteId,
      userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
