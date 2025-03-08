import { Public } from '@/infra/auth/public'
import { EmailService } from '@/infra/email/email.service'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ForgotPasswordUseCase } from '@/domain/application/main/User/use-cases/forgot-password'

const forgetPasswordBodySchema = z.object({
  email: z.string().email(),
})

type ForgetPasswordBodySchema = z.infer<typeof forgetPasswordBodySchema>

@Controller('/forgot-password')
@Public()
export class ForgotPasswordController {
  constructor(
    private emailService: EmailService,
    private forgotPassword: ForgotPasswordUseCase
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(forgetPasswordBodySchema))
  async handle(@Body() body: ForgetPasswordBodySchema) {
    const { email } = body

    const result = await this.forgotPassword.execute({
      email,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const token = result.value.token

    await this.emailService.sendEmail(email, token)
  }
}
