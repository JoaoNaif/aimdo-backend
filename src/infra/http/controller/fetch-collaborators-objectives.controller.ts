import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { FetchCollaboratorsObjectivesUseCase } from '@/domain/application/main/Objective/use-cases/fetch-collaborators-objectives'
import { CollaboratorPresenter } from '../presenters/collaborator-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/objectives/collaborators/:objectiveId')
export class FetchCollaboratorsObjectivesController {
  constructor(
    private fetchCollaboratorsObjectives: FetchCollaboratorsObjectivesUseCase
  ) {}

  @Get()
  async handle(
    @Param('objectiveId') objectiveId: string,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema
  ) {
    const result = await this.fetchCollaboratorsObjectives.execute({
      objectiveId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const collaborators = result.value.collaborators

    return collaborators.map(CollaboratorPresenter.toHTTP)
  }
}
