import { InMemoryCheckInsRepository } from '@/repositories/memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, vi, it } from 'vitest'
import { CheckInsUseCase } from './check-in.usecase'
import { InMemoryGymsRepository } from '@/repositories/memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInsUseCase

describe('Check ins Use Case', async () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInsUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      description: null,
      title: 'Javascript Gym',
      latitude: new Decimal(-10.4244255),
      longitude: new Decimal(-48.2735002),
      phone: '',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -10.4243931,
      userLongitude: -48.2737034,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 5, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -10.4243931,
      userLongitude: -48.2737034,
    })

    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -10.4243931,
        userLongitude: -48.2737034,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but different day', async () => {
    vi.setSystemTime(new Date(22, 1, 1, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -10.4243931,
      userLongitude: -48.2737034,
    })

    vi.setSystemTime(new Date(22, 1, 8, 9, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -10.4243931,
      userLongitude: -48.2737034,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distance gym', async () => {
    vi.setSystemTime(new Date(22, 1, 8, 9, 0, 0))

    await gymsRepository.create({
      id: 'gym-02',
      description: null,
      title: 'Javascript Gym',
      latitude: new Decimal(-11.4244255),
      longitude: new Decimal(-49.2735002),
      phone: '',
    })

    await expect(
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -10.4243931,
        userLongitude: -48.2737034,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
