import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms.usecase'
import { Decimal } from '@prisma/client/runtime/library'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms.usecase'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Academia do Javascript',
      description: null,
      latitude: -10.3459911,
      longitude: -48.2823005,
      phone: '',
    })

    await gymsRepository.create({
      title: 'Academia do Typescript',
      description: null,
      latitude: -9.6935651,
      longitude: -48.1776555,
      phone: '',
    })

    const { gyms } = await sut.execute({
      userLatitude: -10.2662144,
      userLongitude: -48.316416,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia do Javascript' }),
    ])
  })

  // it('should be able to fetch paginated gyms', async () => {
  //   for (let i = 1; i <= 22; i++) {
  //     await gymsRepository.create({
  //       title: 'Academia do Typescript ' + i,
  //       description: null,
  //       latitude: -10.4244255,
  //       longitude: -48.2735002,
  //       phone: '',
  //     })
  //   }

  //   const { gyms } = await sut.execute({ query: 'Academia', page: 2 })

  //   expect(gyms).toHaveLength(2)
  //   expect(gyms).toEqual([
  //     expect.objectContaining({ title: 'Academia do Typescript 21' }),
  //     expect.objectContaining({ title: 'Academia do Typescript 22' }),
  //   ])
  // })
})
