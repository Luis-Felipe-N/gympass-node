import { InMemoryCheckInsRepository } from '@/repositories/memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, vi, it } from 'vitest'
import { CheckInsUseCase } from './check-in.usecase'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInsUseCase

describe('Check ins Use Case', async () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInsUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'ass',
      userId: 'ass',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    const date = new Date(22, 1, 1, 13, 0, 0)
    vi.setSystemTime(date)

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but different day', async () => {
    vi.setSystemTime(new Date(22, 1, 1, 13, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    vi.setSystemTime(new Date(22, 1, 1, 12, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toBe(expect.any(String))
  })
})

const date = new Date(2000, 1, 1, 13)
vi.setSystemTime(date)
