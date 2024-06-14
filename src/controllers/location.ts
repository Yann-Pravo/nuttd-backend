import { Request, Response } from 'express'
import { endOfYear, startOfYear } from 'date-fns'
import { client } from '../libs/client'
import { handleError } from '../utils/errors'

export const getNutCountByLocation = async (req: Request, res: Response) => {
  const { geoScope } = req.query

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let citiesWithNutCount: any[] = []
    let countriesWithNutCount = {}

    if (geoScope === 'countries') {
      countriesWithNutCount = locations.reduce((acc, location) => {
        if (!location.countryCode) return
        if (!acc[location.countryCode]) {
          acc[location.countryCode] = {
            countryCode: location.countryCode,
            country: location.country,
            nutCount: 0,
          }
        }
        acc[location.countryCode].nutCount += location.nuts.length
        return acc
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, {} as any)

      // locationsWithNutCount = Object.keys(countryNutCounts).map(
      //   (key) => countryNutCounts[key]
      // )
    } else {
      citiesWithNutCount = locations
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
    }

    res
      .status(200)
      .json({ cities: citiesWithNutCount, countries: countriesWithNutCount })
  } catch (err) {
    handleError(err, res)
  }
}
