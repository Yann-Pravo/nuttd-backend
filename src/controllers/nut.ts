import { Request, Response } from 'express'
import { client } from '../libs/client'
import { handleError } from '../utils/errors'
import {
  calculateAverageNutsPerDay,
  getPublicNut,
  getPublicNuts,
} from '../utils/helpers'
import {
  getUserRankByCityForCurrentMonth,
  getUserRankByCityForCurrentYear,
  getUserRankByCountryForCurrentMonth,
  getUserRankByCountryForCurrentYear,
} from '../utils/queries'
import {
  endOfQuarter,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subDays,
  subQuarters,
} from 'date-fns'

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
  const { id } = req.user

  try {
    const nuts = await client.nut.findMany({
      take: 30,
      where: {
        userId: id,
      },
      select: {
        id: true,
        date: true,
        comment: true,
        location: {
          select: {
            city: true,
            country: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    })

    return res.status(200).json(nuts)
  } catch (err) {
    handleError(err, res)
  }
}

const getMyNutsPeriodCount = async (date: Date, userId: string) => {
  try {
    return await client.nut.count({
      where: {
        userId,
        date: {
          gte: date,
        },
      },
    })
  } catch (err) {
    return err
  }
}

const getAverageNutsPerDayForQuarters = async (userId: string) => {
  const now = new Date()
  const startOfCurrentQuarter = startOfQuarter(now)
  const endOfCurrentQuarter = endOfQuarter(now)
  const startOfLastQuarter = startOfQuarter(subQuarters(now, 1))
  const endOfLastQuarter = endOfQuarter(subQuarters(now, 1))

  try {
    // Fetch nuts for the current quarter
    const nutsCurrentQuarter = await client.nut.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfCurrentQuarter,
          lte: endOfCurrentQuarter,
        },
      },
    })

    // Fetch nuts for the last quarter
    const nutsLastQuarter = await client.nut.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfLastQuarter,
          lte: endOfLastQuarter,
        },
      },
    })

    const averageNutsPerDayCurrentQuarter = calculateAverageNutsPerDay(
      nutsCurrentQuarter,
      startOfCurrentQuarter,
      endOfCurrentQuarter
    )
    const averageNutsPerDayLastQuarter = calculateAverageNutsPerDay(
      nutsLastQuarter,
      startOfLastQuarter,
      endOfLastQuarter
    )

    return {
      currentQuarter: Number(averageNutsPerDayCurrentQuarter.toFixed(2)),
      lastQuarter: Number(averageNutsPerDayLastQuarter.toFixed(2)),
    }
  } catch (err) {
    return err
  }
}

const getNutCountForLast31Days = async (userId: string) => {
  const startDate = subDays(new Date(), 31)

  try {
    const nutCount = await client.nut.count({
      where: {
        userId: userId,
        createdAt: {
          gte: startDate,
        },
      },
    })

    return nutCount
  } catch (err) {
    return err
  }
}

export const getMyNutsCount = async (req: Request, res: Response) => {
  const { id } = req.user

  const startOfMonthDate = startOfMonth(new Date())
  const startOfYearDate = startOfYear(new Date())

  try {
    const currentMonthCount = await getMyNutsPeriodCount(startOfMonthDate, id)
    const currentYearCount = await getMyNutsPeriodCount(startOfYearDate, id)

    const averageNutPerDayForQuarters =
      await getAverageNutsPerDayForQuarters(id)

    const nutCountForLast31Days = await getNutCountForLast31Days(id)

    return res.status(200).json({
      currentMonthCount,
      currentYearCount,
      ...averageNutPerDayForQuarters,
      nutCountForLast31Days,
    })
  } catch (err) {
    handleError(err, res)
  }
}

export const getMyNutsRank = async (req: Request, res: Response) => {
  const { id } = req.user

  try {
    const user = await client.user.findFirst({
      where: {
        id: {
          equals: id,
          mode: 'insensitive',
        },
      },
      include: {
        location: true,
      },
    })

    if (!user.locationId) throw new Error('No location given')

    const userLocation = await client.location.findFirst({
      where: {
        id: {
          equals: user.locationId,
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
  const { id } = req.user

  if (!id)
    return res.status(400).json({ msg: 'The id of the user is missing.' })

  try {
    const user = await client.user.findFirst({
      where: {
        id: {
          equals: id,
          mode: 'insensitive',
        },
      },
    })

    await client.nut.create({
      data: {
        date: req.body.date,
        comment: req.body.comment,
        user: {
          connect: { id },
        },
        location: {
          connect: {
            id: user.locationId,
          },
        },
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
