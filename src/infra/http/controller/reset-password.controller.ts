import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common'
import { ResetPasswordUserUseCase } from '@/domain/application/main/User/use-cases/reset-password-user'
import { ConfirmPasswordCredentialsError } from '@/domain/application/main/User/errors/confirm-password-credentials-error'
import { OldPasswordCredentialsError } from '@/domain/application/main/User/errors/old-password-credentials-error'

const resetPasswordBodySchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
  confirmNewPassword: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(resetPasswordBodySchema)

type ResetPasswordBodySchema = z.infer<typeof resetPasswordBodySchema>

@Controller('/user/password-reset/:userId')
export class ResetPasswordController {
  constructor(private resetPassword: ResetPasswordUserUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ResetPasswordBodySchema,
    @Param('userId') userId: string
  ) {
    const { confirmNewPassword, newPassword, oldPassword } = body

    const result = await this.resetPassword.execute({
      userId,
      confirmNewPassword,
      newPassword,
      oldPassword,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OldPasswordCredentialsError:
          throw new UnauthorizedException(error.message)
        case ConfirmPasswordCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
