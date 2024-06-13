import { Request, Response } from 'express'
import { client } from '../libs/client'
import { handleError } from '../utils/errors'
import { startOfMonth, endOfMonth } from 'date-fns'
import { GuildNut, getPrivateGuild } from '../utils/helpers'

export const getGuilds = async (req: Request, res: Response) => {
  try {
    const guilds = await client.guild.findMany({
      select: {
        id: true,
        isPrivate: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    })

    const guildsWithUserCount = guilds.map((guild) => ({
      id: guild.id,
      createdAt: guild.createdAt,
      isPrivate: guild.isPrivate,
      name: guild.name,
      userCount: guild._count.users,
    }))

    res.status(200).json(guildsWithUserCount)
  } catch (err) {
    handleError(err, res)
  }
}

export const createGuild = async (req: Request, res: Response) => {
  const { id } = req.user

  if (!id)
    return res.status(400).json({ msg: 'The id of the user is missing.' })

  try {
    const guild = await client.guild.create({
      data: {
        name: req.body.name,
        isPrivate: req.body.isPrivate,
        users: {
          connect: { id },
        },
        admins: {
          connect: { id },
        },
      },
    })

    return res.send(guild)
  } catch (err) {
    handleError(err, res)
  }
}

export const getGuild = async (req: Request, res: Response) => {
  const { guildId } = req.params

  const startDate = startOfMonth(new Date())
  const endDate = endOfMonth(new Date())

  try {
    const guild = await client.guild.findUnique({
      where: { id: guildId },
      select: {
        id: true,
        isPrivate: true,
        name: true,
        users: {
          select: {
            id: true,
            nuts: {
              where: {
                date: {
                  gte: startDate,
                  lte: endDate,
                },
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
            },
            profile: {
              select: {
                displayName: true,
              },
            },
          },
        },
      },
    })

    let nuts: GuildNut[] = []

    const usersWithNutsCount = guild.users
      .map((user) => {
        nuts = [
          ...nuts,
          ...user.nuts.map((nut) => ({
            id: nut.id,
            date: nut.date,
            displayName: user.profile.displayName,
            comment: nut.comment,
            location: nut.location,
          })),
        ]
        return {
          ...user,
          nutsMonthlyCount: user.nuts.length,
          nuts: undefined,
        }
      })
      .sort((userA, userB) =>
        userB.nutsMonthlyCount > userA.nutsMonthlyCount ? 1 : -1
      )

    nuts = nuts.sort((nutA, nutB) => (nutB.date > nutA.date ? 1 : -1))

    if (guild)
      return res
        .status(200)
        .json(getPrivateGuild({ ...guild, users: usersWithNutsCount, nuts }))

    return res.sendStatus(404)
  } catch (err) {
    handleError(err, res)
  }
}

export const joinGuild = async (req: Request, res: Response) => {
  const { id } = req.user
  const { guildId } = req.params

  if (!id)
    return res.status(400).json({ msg: 'The id of the user is missing.' })

  try {
    await client.guild.update({
      where: { id: guildId },
      data: {
        users: {
          connect: { id },
        },
      },
      include: {
        users: true,
      },
    })

    return res.sendStatus(200)
  } catch (err) {
    handleError(err, res)
  }
}
