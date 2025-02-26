import { RegisterUserUseCase } from '@/domain/application/main/User/use-cases/register-user'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { UsernameAlreadyExistError } from '@/domain/application/main/User/errors/user-username-already.exist'
import { EmailAlreadyExistError } from '@/domain/application/main/User/errors/user-email-already-exist-error'

const registerUserBodySchema = z.object({
  username: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>

@Controller('/register')
@Public()
export class RegisterUserController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerUserBodySchema))
  async handle(@Body() body: RegisterUserBodySchema) {
    const { email, name, password, username } = body

    const result = await this.registerUser.execute({
      email,
      name,
      username,
      password,
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
