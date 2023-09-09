import { makeCreateGymsUseCase } from '@/use-case/factories/make-create-gym-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymsBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const data = createGymsBodySchema.parse(request.body)

  const createGymsUseCase = makeCreateGymsUseCase()

  await createGymsUseCase.execute({
    ...data,
  })

  reply.status(201).send()
}
