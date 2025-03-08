import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface PasswordResetTokenProps {
  token: string
  userId: UniqueEntityId
  used: boolean
  expiresAt: Date
  createdAt: Date
}

export class PasswordResetToken extends Entity<PasswordResetTokenProps> {
  get token() {
    return this.props.token
  }

  get userId() {
    return this.props.userId
  }

  get used() {
    return this.props.used
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  use() {
    this.props.used = true
  }

  static create(
    props: Optional<
      PasswordResetTokenProps,
      'createdAt' | 'expiresAt' | 'used'
    >,
    id?: UniqueEntityId
  ) {
    const now = new Date()

    const expiresAt =
      props.expiresAt ?? new Date(now.getTime() + 60 * 60 * 1000) // 1h para expirar

    const passwordResetToken = new PasswordResetToken(
      {
        ...props,
        used: false,
        expiresAt,
        createdAt: props.createdAt ?? now,
      },
      id
    )

    return passwordResetToken
  }
}
