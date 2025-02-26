import { UseCaseError } from '@/core/errors/use-case-error'

export class InviteNotPedingError extends Error implements UseCaseError {
  constructor() {
    super('Invitation is not pending')
  }
}
