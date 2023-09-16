import { FastifyInstance } from 'fastify'

import { verifyJwtMiddleware } from '@/middleware/verify-jwt.middleware'
import { create } from './create.controller'
import { history } from './history.controller'

export async function gymsRouter(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwtMiddleware)

  app.get('/check-ins/history', history)

  app.post('/gyms/:gymId/check-ins', create)
}
