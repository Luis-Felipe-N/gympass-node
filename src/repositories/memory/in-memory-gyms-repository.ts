import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { FetchManyNearbyParams, GymsRepository } from '../gyms-repository'
import { Gym, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findManyNearby(data: FetchManyNearbyParams) {
    const gyms = this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: data.latitude, longitude: data.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      return distance < 10
    })

    return gyms
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = this.items
      .filter((item) =>
        item.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
      )
      .slice((page - 1) * 20, page * 20)

    return gyms
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async findById(gymId: string) {
    const gymMemory = this.items.find((gym) => gymId === gym.id)

    if (!gymMemory) {
      return null
    }

    return gymMemory
  }
}
