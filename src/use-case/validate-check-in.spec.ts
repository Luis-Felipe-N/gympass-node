import { InMemoryCheckInsRepository } from '@/repositories/memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, vi, it } from 'vitest'
import { ValidateCheckInsUseCase } from './validate-check-in.usecase'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidateError } from './errors/late-check-in-validate-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInsUseCase

describe('Validate check ins Use Case', async () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInsUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check in', async () => {
    await expect(
      sut.execute({ checkInId: 'inexistent-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should no be able to validate the check in after 20 minute of its created', async () => {
    vi.setSystemTime(new Date(2022, 5, 20, 8, 0, 0))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinuteInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinuteInMs)

    await expect(
      sut.execute({ checkInId: createdCheckIn.id }),
    ).rejects.toBeInstanceOf(LateCheckInValidateError)
  })
})
