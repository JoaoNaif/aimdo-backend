import { GetUserUseCase } from '@/domain/application/main/User/use-cases/get-user'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { UserPresenter } from '../presenters/user-presenter'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

@Controller('/user')
export class GetUserContoller {
  constructor(private getUser: GetUserUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.getUser.execute({
      userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      user: UserPresenter.toHTTP(result.value.user),
    }
  }
}
