export interface EditUserUseCaseRequest {
  userId: string
  name?: string | null
  username?: string | null
  email?: string | null
}
