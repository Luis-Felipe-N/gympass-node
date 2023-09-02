import { prisma } from '@/lib/prisma'
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExists } from './errors/user-already-exists-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userAlreadyExistsSameEmail =
      await this.usersRepository.findByEmail(email)

    if (userAlreadyExistsSameEmail) {
      throw new UserAlreadyExists()
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
