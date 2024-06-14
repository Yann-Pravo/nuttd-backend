import { Request, Response } from 'express'
import { endOfYear, startOfYear } from 'date-fns'
import { client } from '../libs/client'
import { handleError } from '../utils/errors'

export const getNutCountByLocation = async (_: Request, res: Response) => {
  try {
    const startOfCurrentYear = startOfYear(new Date())
    const endOfCurrentYear = endOfYear(new Date())

    const locations = await client.location.findMany({
      where: {
        NOT: {
          longitude: null,
          latitude: null,
        },
      },
      include: {
        nuts: {
          where: {
            createdAt: {
              gte: startOfCurrentYear,
              lte: endOfCurrentYear,
            },
          },
        },
      },
    })

    const locationsWithNutCount = locations
      .map((location) => ({
        id: location.id,
        city: location.city,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
        nutCount: location.nuts.length,
      }))
      .sort((locationA, locationB) =>
        locationB.nutCount > locationA.nutCount ? 1 : -1
      )

    res.status(200).json(locationsWithNutCount)
  } catch (err) {
    handleError(err, res)
  }
}
