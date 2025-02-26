export interface ResetPasswordUserUseCaseRequest {
  userId: string
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}
