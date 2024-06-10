import { Request, Response } from 'express'
import { client } from '../libs/client'
import { handleError } from '../utils/errors'
import {
  getPublicNut,
  getPublicNuts,
  getUniqueCityCountry,
} from '../utils/helpers'
import {
  getUserRankByCityForCurrentMonth,
  getUserRankByCityForCurrentYear,
  getUserRankByCountryForCurrentMonth,
  getUserRankByCountryForCurrentYear,
} from '../utils/queries'

export const getNuts = async (_: Request, res: Response) => {
  try {
    const nuts = await client.nut.findMany()

    res.status(200).json(getPublicNuts(nuts))
  } catch (err) {
    handleError(err, res)
  }
}

export const getNut = async (req: Request, res: Response) => {
  const { nutID } = req.params

  try {
    const nut = await client.nut.findUnique({
      where: { id: nutID },
    })

    if (nut) return res.status(200).json(getPublicNut(nut))

    return res.sendStatus(404)
  } catch (err) {
    handleError(err, res)
  }
}

export const getMyNuts = async (req: Request, res: Response) => {
  try {
    const nuts = await client.nut.findMany({
      where: { userId: req.user?.id },
    })

    return res.status(200).json(getPublicNuts(nuts))
  } catch (err) {
    handleError(err, res)
  }
}

export const getMyNutsCount = async (req: Request, res: Response) => {
  const { id } = req.user

  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  )

  const startOfYear = new Date(new Date().getFullYear(), 0, 1)

  try {
    const currentMonthCount = await client.nut.count({
      where: {
        userId: id,
        date: {
          gte: startOfMonth,
        },
      },
    })

    const currentYearCount = await client.nut.count({
      where: {
        userId: id,
        date: {
          gte: startOfYear,
        },
      },
    })

    return res.status(200).json({ currentMonthCount, currentYearCount })
  } catch (err) {
    handleError(err, res)
  }
}

export const getMyNutsRank = async (req: Request, res: Response) => {
  const { id } = req.user
  const location = req.body.location

  try {
    if (!location) throw new Error('No location given')

    const userLocation = await client.location.findFirst({
      where: {
        citycountry: {
          equals: getUniqueCityCountry(location),
          mode: 'insensitive',
        },
      },
    })

    if (!userLocation) throw new Error('Location not found')

    const monthRankCity = await getUserRankByCityForCurrentMonth(
      userLocation.id,
      id
    )
    const yearRankCity = await getUserRankByCityForCurrentYear(
      userLocation.id,
      id
    )

    const monthRankCountry = await getUserRankByCountryForCurrentMonth(
      userLocation.countryCode,
      id
    )

    const yearRankCountry = await getUserRankByCountryForCurrentYear(
      userLocation.countryCode,
      id
    )

    return res.status(200).json({
      monthRankCity: monthRankCity[0]?.user_rank || null,
      yearRankCity: yearRankCity[0]?.user_rank || null,
      monthRankCountry: monthRankCountry[0]?.user_rank || null,
      yearRankCountry: yearRankCountry[0]?.user_rank || null,
    })
  } catch (err) {
    handleError(err, res)
  }
}

export const createNut = async (req: Request, res: Response) => {
  const userId = req.user?.id

  if (!userId)
    return res.status(400).json({ msg: 'The id of the user is missing.' })

  const location = req.body.location

  try {
    await client.nut.create({
      data: {
        date: req.body.date,
        user: {
          connect: { id: userId },
        },
        ...(location && {
          location: {
            connectOrCreate: {
              create: {
                citycountry: getUniqueCityCountry(location),
                ...location,
              },
              where: {
                citycountry: getUniqueCityCountry(location),
              },
            },
          },
        }),
      },
    })

    return res.sendStatus(200)
  } catch (err) {
    handleError(err, res)
  }
}

export const updateNut = async (req: Request, res: Response) => {
  const { nutID } = req.params
  const userId = req.user?.id

  if (!userId)
    return res.status(400).json({ msg: 'The id of the user is missing.' })

  try {
    await client.nut.update({
      where: { id: nutID, userId },
      data: req.body,
    })

    return res.sendStatus(200)
  } catch (err) {
    handleError(err, res)
  }
}

export const deleteNut = async (req: Request, res: Response) => {
  const { nutID } = req.params
  const userId = req.user?.id

  if (!userId)
    return res.status(400).json({ msg: 'The id of the user is missing.' })

  try {
    await client.nut.delete({
      where: { id: nutID, userId },
    })

    return res.sendStatus(200)
  } catch (err) {
    handleError(err, res)
  }
}
