import { Request, Response } from 'express'
import db from '../../client'
import { handleError } from '../utils/errors'

export const getNuts = (_: Request, res: Response) => {
  db.nut
    .findMany()
    .then((result) => res.status(200).json({ result }))
    .catch(() => res.status(404).json({ msg: 'Nuts not found' }))
}

export const getNut = async (req: Request, res: Response) => {
  const { nutID } = req.params

  try {
    const nut = await db.nut.findUnique({
      where: { id: nutID },
    })

    return res.status(200).json(nut)
  } catch (err) {
    handleError(err, res)
  }
}
