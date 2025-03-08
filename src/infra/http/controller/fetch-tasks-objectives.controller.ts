import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { FetchTasksObjectivesUseCase } from '@/domain/application/main/Objective/use-cases/fetch-tasks-objectives'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ObjectivesPresenter } from '../presenters/objectives-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/objectives/tasks')
export class FetchTasksObjectivesController {
  constructor(private fetchTasksObjectives: FetchTasksObjectivesUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub

    const result = await this.fetchTasksObjectives.execute({
      authorId: userId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const tasks = result.value.tasks

    return { tasks: tasks.map(ObjectivesPresenter.toHTTP) }
  }
}
