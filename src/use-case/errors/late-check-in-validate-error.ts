export class LateCheckInValidateError extends Error {
  constructor() {
    super('The check in can be only validate utils 20 minute of its created.')
  }
}
