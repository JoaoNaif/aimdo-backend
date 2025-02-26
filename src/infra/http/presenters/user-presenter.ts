export class UserPresenter {
  static toHTTP(user: DTOGetUserResponse) {
    return {
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
      createdAt: user.createdAt,
    }
  }
}
