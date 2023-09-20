import { FastifyInstance } from 'fastify'

import { verifyJwtMiddleware } from '@/middleware/verify-jwt.middleware'
import { create } from './create.controller'
import { history } from './history.controller'
import { metrics } from './metrics.controller'
import { validate } from './validate.controller'

export async function gymsRouter(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwtMiddleware)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)

  app.post('/gyms/:gymId/check-ins', create)
  app.patch('/check-ins/:checkInId/validate', validate)
}
