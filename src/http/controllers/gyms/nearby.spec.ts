import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/lib/test/create-and-authenticate-user'

describe('Nearby (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be to able to get nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript academia',
        description: '',
        phone: '',
        latitude: -10.3459911,
        longitude: -48.2823005,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Python academia',
        description: '',
        phone: '',
        latitude: -9.6935651,
        longitude: -48.1776555,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -10.2662144,
        longitude: -48.316416,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript academia' }),
    ])
  })
})
