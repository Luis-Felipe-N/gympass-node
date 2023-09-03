import { FastifyRequest, FastifyReply } from 'fastify'

import { z } from 'zod'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { InvalidCredentialsError } from '@/use-case/errors/invalid-credentials-error'
import { AuthenticateUseCase } from '@/use-case/authenticate.usecase'
import { error } from 'console'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    await authenticateUseCase.execute({ email, password })
    console.log(email, password)
  } catch (error) {
    console.log(error)
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }
  }

  return reply.status(200).send()
}
