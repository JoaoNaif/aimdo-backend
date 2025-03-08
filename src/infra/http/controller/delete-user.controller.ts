import { DeleteUserUseCase } from '@/domain/application/main/User/use-cases/delete-user'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/user')
export class DeleteUserController {
  constructor(private deleteUser: DeleteUserUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.deleteUser.execute({
      userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
