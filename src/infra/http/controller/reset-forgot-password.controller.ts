import { ResetForgotPasswordUseCase } from '@/domain/application/main/User/use-cases/reset-forgot-password'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const resetForgotPasswordBodySchema = z.object({
  password: z.string(),
  confirmPassword: z.string(),
  token: z.string(),
  email: z.string().email(),
})

type ResetForgotPasswordBodySchema = z.infer<
  typeof resetForgotPasswordBodySchema
>

@Controller('/reset-forgot-password')
@Public()
export class ResetForgotPasswordController {
  constructor(private resetForgotPassword: ResetForgotPasswordUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(resetForgotPasswordBodySchema))
  async handle(@Body() body: ResetForgotPasswordBodySchema) {
    const { confirmPassword, password, token, email } = body

    const result = await this.resetForgotPassword.execute({
      confirmPassword,
      password,
      email,
      token,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
