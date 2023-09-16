import { FastifyInstance } from 'fastify'

import { verifyJwtMiddleware } from '@/middleware/verify-jwt.middleware'
import { create } from './create.controller'
import { search } from './search.controller'
import { nearby } from './nearby.controller'

export async function gymsRouter(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwtMiddleware)

  app.get('/search', search)
  app.get('/gyms/nearby', nearby)

  app.post('/gyms', create)
}
