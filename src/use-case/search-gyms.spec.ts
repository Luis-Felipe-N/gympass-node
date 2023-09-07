import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms.usecase'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Academia do Javascript',
      description: null,
      latitude: -10.4244255,
      longitude: -48.2735002,
      phone: '',
    })

    await gymsRepository.create({
      title: 'Academia do Typescript',
      description: null,
      latitude: -10.4244255,
      longitude: -48.2735002,
      phone: '',
    })

    const { gyms } = await sut.execute({ query: 'javascript', page: 1 })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia do Javascript' }),
    ])
  })

  it('should be able to fetch paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: 'Academia do Typescript ' + i,
        description: null,
        latitude: -10.4244255,
        longitude: -48.2735002,
        phone: '',
      })
    }

    const { gyms } = await sut.execute({ query: 'Academia', page: 2 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia do Typescript 21' }),
      expect.objectContaining({ title: 'Academia do Typescript 22' }),
    ])
  })
})
