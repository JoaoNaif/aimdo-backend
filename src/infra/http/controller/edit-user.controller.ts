import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { EditUserUseCase } from '@/domain/application/main/User/use-cases/edit-user'
import { EmailAlreadyExistError } from '@/domain/application/main/User/errors/user-email-already-exist-error'
import { UsernameAlreadyExistError } from '@/domain/application/main/User/errors/user-username-already.exist'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const editUserBodySchema = z.object({
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  username: z.string().nullable(),
})

const bodyValidationPipe = new ZodValidationPipe(editUserBodySchema)

type EditUserBodySchema = z.infer<typeof editUserBodySchema>

@Controller('/user/edit')
export class EditUserController {
  constructor(private editUser: EditUserUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditUserBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { email, name, username } = body

    const userId = user.sub

    const result = await this.editUser.execute({
      userId,
      email,
      name,
      username,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case EmailAlreadyExistError:
          throw new ConflictException(error.message)
        case UsernameAlreadyExistError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
