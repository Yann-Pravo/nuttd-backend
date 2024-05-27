import { Request, Response } from 'express'
import { client } from '@/libs/client'
import { handleError } from '../utils/errors'

export const createProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id

  if (!userId)
    return res.status(400).json({ msg: 'The id of the user is missing.' })

  try {
    await client.profile.create({
      data: { ...req.body, userId },
    })

    return res.sendStatus(200)
  } catch (err) {
    handleError(err, res)
  }
}
