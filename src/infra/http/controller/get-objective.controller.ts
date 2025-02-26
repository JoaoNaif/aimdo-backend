import { GetObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/get-objective'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ObjectivePresenter } from '../presenters/objective-presenter'

@Controller('/objective/:objectiveId')
export class GetObjectiveController {
  constructor(private getObjective: GetObjectiveUseCase) {}

  @Get()
  async handle(@Param('objectiveId') objectiveId: string) {
    const result = await this.getObjective.execute({
      objectiveId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      objective: ObjectivePresenter.toHTTP(result.value.objective),
    }
  }
}
