import { FastifyRequest, FastifyReply } from 'fastify'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { hash } from 'bcryptjs'
import { registerUseCase } from '@/use-case/register.usecase'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    registerUseCase({ name, email, password })
    return reply.status(201).send()
  } catch (error) {
    return reply.status(409).send()
  }
}
