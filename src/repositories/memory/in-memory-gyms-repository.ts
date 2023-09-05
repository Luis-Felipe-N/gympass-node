import { Decimal } from '@prisma/client/runtime/library'
import { GymsRepository } from '../gyms-repository'
import { Gym } from '@prisma/client'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(gymId: string) {
    const gymMemory = this.items.find((gym) => gymId === gym.id)

    if (!gymMemory) {
      return null
    }

    return gymMemory
  }
}
