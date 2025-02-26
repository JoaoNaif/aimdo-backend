import { DeleteUserUseCase } from '@/domain/application/main/User/use-cases/delete-user'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/user/:userId')
export class DeleteUserController {
  constructor(private deleteUser: DeleteUserUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('userId') userId: string) {
    const result = await this.deleteUser.execute({
      userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
