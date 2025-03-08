import { FetchObjectiveInviteUseCase } from '@/domain/application/main/Objective/use-cases/fetch-objective-invite'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { BadRequestException, Controller, Get } from '@nestjs/common'
import { InivitePresenter } from '../presenters/invite-presenter'

@Controller('/objectives/invites')
export class FetchObjectiveInviteController {
  constructor(private fetchObjectiveInvite: FetchObjectiveInviteUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const collaboratorId = user.sub

    const result = await this.fetchObjectiveInvite.execute({
      collaboratorId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const invites = result.value.invites

    return { invites: invites.map(InivitePresenter.toHTTP) }
  }
}
