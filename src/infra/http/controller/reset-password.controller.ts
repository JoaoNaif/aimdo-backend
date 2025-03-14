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
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const resetPasswordBodySchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
  confirmNewPassword: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(resetPasswordBodySchema)

type ResetPasswordBodySchema = z.infer<typeof resetPasswordBodySchema>

@Controller('/user/password-reset')
export class ResetPasswordController {
  constructor(private resetPassword: ResetPasswordUserUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ResetPasswordBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { confirmNewPassword, newPassword, oldPassword } = body

    const userId = user.sub

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
