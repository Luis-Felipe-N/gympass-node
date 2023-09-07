import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins.repository'
import { CheckInsUseCase } from '../check-in.usecase'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CheckInsUseCase(checkInsRepository, gymsRepository)

  return useCase
}
