import { AddCollaboratorsObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/add-collaborators-objective'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'

@Controller('objective/add-collaborator/:inviteId')
export class AddCollaboratorsObjectiveController {
  constructor(
    private addCollaboratorsObjective: AddCollaboratorsObjectiveUseCase
  ) {}

  @Put()
  @HttpCode(204)
  async handle(@Param('inviteId') inviteId: string) {
    const result = await this.addCollaboratorsObjective.execute({
      inviteId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
