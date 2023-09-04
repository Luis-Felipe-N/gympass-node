import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'
import { before } from 'node:test'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const beforeOfTheDay = dayjs(date).endOf('date')

    const checkIn = this.items.find(({ user_id, created_at }) => {
      const checkInDate = dayjs(created_at)
      const inOnSameDay =
        checkInDate.isBefore(beforeOfTheDay) &&
        checkInDate.isAfter(startOfTheDay)
      return userId === user_id && inOnSameDay
    })

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }

    this.items.push(checkIn)

    return checkIn
  }
}
