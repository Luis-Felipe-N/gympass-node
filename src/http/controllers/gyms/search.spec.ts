import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/lib/test/create-and-authenticate-user'

describe('Search (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be to able to search a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript academia',
        description: '',
        phone: '',
        latitude: -10.4244255,
        longitude: -48.2735002,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Python academia',
        description: '',
        phone: '',
        latitude: -10.4244255,
        longitude: -48.2735002,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'Python',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Python academia' }),
    ])
  })
})
