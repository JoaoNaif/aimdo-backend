export interface ResetForgotPasswordUseCaseRequest {
  email: string
  token: string
  password: string
  confirmPassword: string
}
