import { makeSearchGymsUseCase } from '@/use-case/factories/make-search-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsBodySchema = z.object({
    query: z.string(),
    page: z.number().min(1).default(1),
  })

  const { query, page } = searchGymsBodySchema.parse(request.query)

  const searchGymsUseCase = makeSearchGymsUseCase()

  const gyms = await searchGymsUseCase.execute({
    query,
    page,
  })

  reply.status(200).send({ gyms })
}
