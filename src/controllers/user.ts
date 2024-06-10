import { Request, Response } from 'express'
import { client } from '../libs/client'
import { handleError } from '../utils/errors'
import {
  comparePassword,
  getPrivateUser,
  getPublicUsers,
  getUniqueCityCountry,
  hashPassword,
} from '../utils/helpers'

export const getUsersByUsername = async (req: Request, res: Response) => {
  const { filter } = req.query

  if (!filter || typeof filter !== 'string' || filter.length < 3)
    return res.status(200).json([])

  try {
    const users = await client.user.findMany({
      take: 10,
      include: {
        profile: {
          where: {
            displayName: {
              contains: filter,
              mode: 'insensitive',
            },
          },
        },
      },
    })

    return res.status(200).json(getPublicUsers(users))
  } catch (err) {
    handleError(err, res)
  }
}

const updateUserLocation = async (id: string, ip: string) => {
  try {
    const response = await fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEOLOCATION_KEY}&ip=${ip}`
    )
    const location = await response.json()

    if (location && location.city && location.country_name) {
      const user = await client.user.update({
        where: { id },
        data: {
          ip,
          location: {
            connectOrCreate: {
              create: {
                citycountry: getUniqueCityCountry(
                  location.city,
                  location.country_name
                ),
                city: location.city,
                country: location.country_name,
                countryCode: location.country_code3,
                countryFlag: location.country_flag,
                region: location.state_code,
                regionName: location.state_prov,
                zip: location.zipcode,
              },
              where: {
                citycountry: getUniqueCityCountry(
                  location.city,
                  location.country_name
                ),
              },
            },
          },
        },
        include: {
          profile: true,
          followers: true,
          following: true,
          guilds: true,
          nuts: true,
          location: true,
        },
      })

      return user
    }
  } catch {
    return null
  }
}

export const getUser = async (req: Request, res: Response) => {
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
        profile: true,
        followers: true,
        following: true,
        guilds: true,
        nuts: true,
        location: true,
      },
    })

    if (!user) throw new Error('User not found')

    let updatedUser
    if (req.ip !== user.ip) {
      updatedUser = await updateUserLocation(id, req.ip)
    }

    return res.send({
      ...getPrivateUser(updatedUser || user),
      ipReq: req.ip,
      ipUser: user.ip,
    })
  } catch (err) {
    handleError(err, res)
  }
}

export const changePassword = async (req: Request, res: Response) => {
  const { id } = req.user

  const { oldPassword, newPassword, verifyNewPassword } = req.body

  try {
    const existingUser = await client.user.findFirst({
      where: {
        id: {
          equals: id,
          mode: 'insensitive',
        },
      },
    })

    if (!existingUser) throw new Error('User not found')

    const isMatchOldPassword = await comparePassword(
      oldPassword,
      existingUser.password || ''
    )
    if (!isMatchOldPassword)
      return res
        .status(400)
        .json('Old password doesn‘t match with the existing one.')

    if (oldPassword === newPassword)
      return res.status(400).json('Old and new passwords are the same.')

    if (newPassword !== verifyNewPassword)
      return res.status(400).json('New passwords don‘t match.')

    const hashedNewPassword = await hashPassword(newPassword)

    await client.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
      },
    })

    return res.sendStatus(200)
  } catch (err) {
    handleError(err, res)
  }
}

export const deleteUserWithProfile = async (req: Request, res: Response) => {
  const { id } = req.user

  try {
    const profile = await client.profile.findUnique({
      where: { userId: id },
    })
    if (profile) await client.profile.delete({ where: { userId: id } })

    await client.user.delete({ where: { id } })

    res.sendStatus(200)
  } catch (err) {
    handleError(err, res)
  }
}
