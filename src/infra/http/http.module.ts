import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { RegisterUserController } from './controller/register-user.controller'
import { RegisterUserUseCase } from '@/domain/application/main/User/use-cases/register-user'
import { AuthenticateUserController } from './controller/authenticate-user.controller'
import { AuthenticateUserUseCase } from '@/domain/application/main/User/use-cases/authenticate-user'
import { GetUserContoller } from './controller/get-user.controller'
import { GetUserUseCase } from '@/domain/application/main/User/use-cases/get-user'
import { EditUserController } from './controller/edit-user.controller'
import { EditUserUseCase } from '@/domain/application/main/User/use-cases/edit-user'
import { DeleteUserController } from './controller/delete-user.controller'
import { DeleteUserUseCase } from '@/domain/application/main/User/use-cases/delete-user'
import { ResetPasswordController } from './controller/reset-password.controller'
import { ResetPasswordUserUseCase } from '@/domain/application/main/User/use-cases/reset-password-user'
import { CreateObjectiveController } from './controller/create-objective.controller'
import { CreateObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/create-objective'
import { FetchObjectivesUseCase } from '@/domain/application/main/Objective/use-cases/fetch-objectives'
import { FetchObjectivesController } from './controller/fetch-objectives.controller'
import { GetObjectiveController } from './controller/get-objective.controller'
import { GetObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/get-objective'
import { FetchTasksObjectivesController } from './controller/fetch-tasks-objectives.controller'
import { FetchTasksObjectivesUseCase } from '@/domain/application/main/Objective/use-cases/fetch-tasks-objectives'
import { FetchGoalsObjectivesController } from './controller/fetch-goals-objectives.controller'
import { FetchGoalsObjectivesUseCase } from '@/domain/application/main/Objective/use-cases/fetch-goals-objectives'
import { FetchBuysObjectivesController } from './controller/fetch-buys-objectives.controller'
import { FetchBuysObjectivesUseCase } from '@/domain/application/main/Objective/use-cases/fetch-buys-objectives'
import { EditObjectiveController } from './controller/edit-objective.controller'
import { EditObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/edit-objective'
import { DeleteObjectiveController } from './controller/delete-objective.controller'
import { DeleteObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/delete-objective'
import { ChangeStatusObjectiveController } from './controller/change-status-objective.controller'
import { ChangeStatusObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/change-status-objective'
import { CanceledStatusObjectiveController } from './controller/canceled-status-objective.controller'
import { CanceledStatusObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/canceled-status-objective'
import { UncanceledStatusObjectiveController } from './controller/uncanceled-status-objective.controller'
import { UncanceledStatusObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/uncanceled-status-objective'
import { InviteCollaboratorObjectiveController } from './controller/invite-collaborator-objective.controller'
import { InviteCollaboratorObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/invite-collaborator-objective'
import { AddCollaboratorsObjectiveController } from './controller/add-collaborators-objective.controller'
import { AddCollaboratorsObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/add-collaborators-objective'
import { RemoveCollaboratorObjectiveController } from './controller/remove-collaborator-objective.controller'
import { RemoveCollaboratorObjectiveUseCase } from '@/domain/application/main/Objective/use-cases/remove-collaborator-objective'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    RegisterUserController,
    AuthenticateUserController,
    GetUserContoller,
    EditUserController,
    DeleteUserController,
    ResetPasswordController,
    CreateObjectiveController,
    FetchObjectivesController,
    GetObjectiveController,
    FetchTasksObjectivesController,
    FetchGoalsObjectivesController,
    FetchBuysObjectivesController,
    EditObjectiveController,
    DeleteObjectiveController,
    ChangeStatusObjectiveController,
    CanceledStatusObjectiveController,
    UncanceledStatusObjectiveController,
    InviteCollaboratorObjectiveController,
    AddCollaboratorsObjectiveController,
    RemoveCollaboratorObjectiveController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    GetUserUseCase,
    EditUserUseCase,
    DeleteUserUseCase,
    ResetPasswordUserUseCase,
    CreateObjectiveUseCase,
    FetchObjectivesUseCase,
    GetObjectiveUseCase,
    FetchTasksObjectivesUseCase,
    FetchGoalsObjectivesUseCase,
    FetchBuysObjectivesUseCase,
    EditObjectiveUseCase,
    DeleteObjectiveUseCase,
    ChangeStatusObjectiveUseCase,
    CanceledStatusObjectiveUseCase,
    UncanceledStatusObjectiveUseCase,
    InviteCollaboratorObjectiveUseCase,
    AddCollaboratorsObjectiveUseCase,
    RemoveCollaboratorObjectiveUseCase,
  ],
})
export class HttpModule {}
