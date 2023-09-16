import { makeCheckInUseCase } from '@/use-case/factories/make-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInsParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInsBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const data = createCheckInsBodySchema.parse(request.body)
  const { gymId } = createCheckInsParamsSchema.parse(request.params)

  const createCheckInUseCase = makeCheckInUseCase()

  await createCheckInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: data.latitude,
    userLongitude: data.longitude,
  })

  reply.status(201).send()
}
