import { Request, Response } from 'express'
import db from '../../client'

export const getNuts = (_: Request, res: Response) => {
  db.nut
    .findMany()
    .then((result) => res.status(200).json({ result }))
    .catch(() => res.status(404).json({ msg: 'Nuts not found' }))
}

export const getNut = (req: Request, res: Response) => {
  const { nutID } = req.params

  if (!nutID) {
    res.status(500).json({ msg: 'No nutID given' })
    return
  }

  db.nut
    .findUnique({
      where: { id: nutID },
    })
    .then((result) => res.status(200).json({ result }))
    .catch(() => res.status(404).json({ msg: 'Nut not found' }))
}

export const createNut = (req: Request, res: Response) => {
  db.nut
    .create({ data: req.body })
    .then((result) => res.status(200).json({ result }))
    .catch((error) => {
      console.log(error)
      res.status(500).json({ msg: error })
    })
}

export const updateNut = (req: Request, res: Response) => {
  const { nutID } = req.params

  if (!nutID) {
    res.status(500).json({ msg: 'No nutID given' })
    return
  }

  db.nut
    .update({
      where: { id: nutID },
      data: req.body,
    })
    .then((result) => res.status(200).json({ result }))
    .catch((error) => res.status(500).json({ msg: error }))
}

export const deleteNut = (req: Request, res: Response) => {
  const { nutID } = req.params

  if (!nutID) {
    res.status(500).json({ msg: 'No nutID given' })
    return
  }

  db.nut
    .delete({
      where: { id: nutID },
    })
    .then((result) => res.status(200).json({ result }))
    .catch(() => res.status(404).json({ msg: 'Nut not found' }))
}
