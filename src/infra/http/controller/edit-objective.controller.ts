import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common'
import { EditObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/edit-objective'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'

const editObjectiveBodySchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  urgency: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  category: z.enum(['TASK', 'BUY', 'GOAL']).optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editObjectiveBodySchema)

type EditObjectiveBodySchema = z.infer<typeof editObjectiveBodySchema>

@Controller('/objective/:objectiveId')
export class EditObjectiveController {
  constructor(private editObjective: EditObjectiveUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditObjectiveBodySchema,
    @Param('objectiveId') objectiveId: string,
    @CurrentUser() user: UserPayload
  ) {
    const { title, description, category, urgency } = body
    const userId = user.sub

    const result = await this.editObjective.execute({
      authorId: userId,
      objectiveId,
      title,
      description,
      category,
      urgency,
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
