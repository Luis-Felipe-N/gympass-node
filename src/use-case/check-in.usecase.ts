import { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { date } from 'zod'

interface CheckInsUseCaseRequest {
  gymId: string
  userId: string
}

interface CheckInsUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInsUseCase {
  constructor(private checkinsRepository: CheckInsRepository) {}

  async execute({
    gymId,
    userId,
  }: CheckInsUseCaseRequest): Promise<CheckInsUseCaseResponse> {
    const checkInOnSameDay = await this.checkinsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new Error()
    }

    const checkIn = await this.checkinsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}
