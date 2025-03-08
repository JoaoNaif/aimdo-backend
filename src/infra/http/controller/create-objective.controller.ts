import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { CreateObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/create-objective'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const createObjectiveBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  urgency: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  category: z.enum(['TASK', 'BUY', 'GOAL']),
  dueDate: z.date().nullable().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createObjectiveBodySchema)

type CreateObjectiveBodySchema = z.infer<typeof createObjectiveBodySchema>

@Controller('/objective')
export class CreateObjectiveController {
  constructor(private createObjective: CreateObjectiveUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateObjectiveBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, description, category, urgency, dueDate } = body
    const userId = user.sub

    const result = await this.createObjective.execute({
      title,
      description,
      authorId: userId,
      category,
      urgency,
      dueDate,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
