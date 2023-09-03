import { describe } from 'node:test'
import { expect, it } from 'vitest'
import { RegisterUseCase } from './register.usecase'
import { compare } from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { InMemoryUsersRepository } from '@/repositories/memory/in-memory-users-repository'
import { UserAlreadyExists } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('Should be able to register', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'Teste da Silva',
      email: 'testedasilva01@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'Teste da Silva',
      email: 'testedasilva01@gmail.com',
      password: '123456',
    })

    const passwordUserIsHashed = await compare('123456', user.password_hash)

    return expect(passwordUserIsHashed).toBe(true)
  })

  it('Should not be able to register with email twice', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'Teste da Silva',
      email: 'testedasilva01@gmail.com',
      password: '123456',
    })

    expect(
      registerUseCase.execute({
        name: 'Teste da Silva',
        email: 'testedasilva01@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExists)
  })
})
