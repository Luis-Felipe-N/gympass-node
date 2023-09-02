export class UserAlreadyExists extends Error {
  constructor() {
    super('User with e-email already exits')
  }
}
