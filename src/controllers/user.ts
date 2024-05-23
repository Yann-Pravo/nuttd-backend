import { Request, Response } from 'express'
import db from '../../client'
import { handleError } from '../utils/errors'
import {
  comparePassword,
  getPrivateUser,
  getPublicUsers,
  hashPassword,
} from '../utils/helpers'

export const getUsersByUsername = async (req: Request, res: Response) => {
  const { filter } = req.query

  if (!filter || typeof filter !== 'string' || filter.length < 3)
    return res.status(200).json([])

  try {
    const users = await db.user.findMany({
      take: 10,
      where: {
        username: {
          contains: filter,
          mode: 'insensitive',
        },
      },
    })

    return res.status(200).json(getPublicUsers(users))
  } catch (err) {
    handleError(err, res)
  }
}

export const getUser = async (req: Request, res: Response) => {
  const { userID } = req.params

  try {
    const user = await db.user.findFirst({
      where: {
        id: {
          equals: userID,
          mode: 'insensitive',
        },
      },
      include: {
        profile: true,
        followers: true,
        following: true,
        guilds: true,
        nuts: true,
      },
    })

    if (!user) throw new Error('User not found')

    return res.status(200).json(getPrivateUser(user))
  } catch (err) {
    handleError(err, res)
  }
}

export const changePassword = async (req: Request, res: Response) => {
  const { userID } = req.params

  const { oldPassword, newPassword, verifyNewPassword } = req.body

  try {
    const existingUser = await db.user.findFirst({
      where: {
        id: {
          equals: userID,
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
        .json({ msg: 'Old password doesn‘t match with the existing one.' })

    if (oldPassword === newPassword)
      return res
        .status(400)
        .json({ msg: 'Old and new passwords are the same.' })

    if (newPassword !== verifyNewPassword)
      return res.status(400).json({ msg: 'New passwords don‘t match.' })

    console.log('OK1')

    const hashedNewPassword = await hashPassword(newPassword)

    console.log('OK2')

    await db.user.update({
      where: { id: userID },
      data: {
        password: hashedNewPassword,
      },
    })

    console.log('OK3')

    return res.sendStatus(200)
  } catch (err) {
    console.log(err)
    handleError(err, res)
  }
}

export const deleteUserWithProfile = async (req: Request, res: Response) => {
  const { userID } = req.params

  try {
    const profile = await db.profile.findUnique({
      where: { userId: userID },
    })
    if (profile) await db.profile.delete({ where: { userId: userID } })

    await db.user.delete({ where: { id: userID } })

    res.sendStatus(200)
  } catch (err) {
    handleError(err, res)
  }
}

export const createUserProfile = async (req: Request, res: Response) => {
  const { userID } = req.params

  try {
    await db.profile.create({
      data: { userId: userID, ...req.body },
    })

    return res.sendStatus(200)
  } catch (err) {
    handleError(err, res)
  }
}

export const getUserNuts = async (req: Request, res: Response) => {
  const { userID } = req.params

  try {
    const nuts = await db.nut.findMany({
      where: { nutterId: userID },
    })

    return res.status(200).json(nuts)
  } catch (err) {
    handleError(err, res)
  }
}

export const createNut = async (req: Request, res: Response) => {
  try {
    db.nut.create({ data: req.body })

    return res.sendStatus(200)
  } catch (err) {
    handleError(err, res)
  }
}

export const updateNut = async (req: Request, res: Response) => {
  const { nutID } = req.params

  try {
    db.nut.update({
      where: { id: nutID },
      data: req.body,
    })

    return res.sendStatus(200)
  } catch (err) {
    handleError(err, res)
  }
}

export const deleteNut = (req: Request, res: Response) => {
  const { nutID } = req.params

  try {
    db.nut.delete({
      where: { id: nutID },
    })

    return res.sendStatus(200)
  } catch (err) {
    handleError(err, res)
  }
}
