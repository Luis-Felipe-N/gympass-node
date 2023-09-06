import { InMemoryGymsRepository } from '@/repositories/memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym.usecase'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Academia do Ty',
      description: '',
      phone: '',
      latitude: 0,
      longitude: 0,
    })

    expect(gym.title).toEqual(expect.any(String))
  })
})
