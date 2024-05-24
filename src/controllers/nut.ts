import { Request, Response } from 'express'
import db from '../../client'
import { handleError } from '../utils/errors'
import { getPublicNut, getPublicNuts } from '../utils/helpers'

export const getNuts = async (_: Request, res: Response) => {
  try {
    const nuts = await db.nut.findMany()

    res.status(200).json(getPublicNuts(nuts))
  } catch (err) {
    handleError(err, res)
  }
}

export const getNut = async (req: Request, res: Response) => {
  const { nutID } = req.params

  try {
    const nut = await db.nut.findUnique({
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
    const nuts = await db.nut.findMany({
      where: { nutterId: req.user?.id },
    })

    return res.status(200).json(getPublicNuts(nuts))
  } catch (err) {
    handleError(err, res)
  }
}

export const createNut = async (req: Request, res: Response) => {
  const userId = req.user?.id

  if (!userId)
    return res.status(400).json({ msg: 'The id of the user is missing.' })

  try {
    await db.nut.create({
      data: {
        ...req.body,
        nutterId: userId,
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
    await db.nut.update({
      where: { id: nutID, nutterId: userId },
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
    await db.nut.delete({
      where: { id: nutID, nutterId: userId },
    })

    return res.sendStatus(200)
  } catch (err) {
    handleError(err, res)
  }
}
