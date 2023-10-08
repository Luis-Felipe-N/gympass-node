import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    email: 'luiss@gmail.com',
    name: 'Luis Felipe',
    password: '123456',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'luiss@gmail.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
