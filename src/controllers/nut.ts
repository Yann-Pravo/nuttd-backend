import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const getNuts = (_: Request, res: Response) => {
  prisma.nut.findMany()
  .then(result => res.status(200).json({ result }))
  .catch(() => res.status(404).json({msg: 'Nuts not found'}))
}

const getNut = (req: Request, res: Response) => {
  const { nutID } = req.params

  if (!nutID) {
    res.status(500).json({msg: 'No nutID given'})
    return
  }

  prisma.nut.findUnique({
      where: { id: nutID },
  })
  .then(result => res.status(200).json({ result }))
  .catch(() => res.status(404).json({msg: 'Nut not found'}))
}

const createNut = (req: Request, res: Response) => {
  prisma.nut.create({ data: req.body })
  .then(result => res.status(200).json({ result }))
  .catch((error) => {
    console.log(error)
    res.status(500).json({msg:  error })
})
}

const updateNut = (req: Request, res: Response) => {
  const { nutID } = req.params

  if (!nutID) {
    res.status(500).json({msg: 'No nutID given'})
    return
  }

  prisma.nut.update({
    where: { id: nutID },
    data: req.body
  })
  .then(result => res.status(200).json({ result }))
  .catch((error) => res.status(500).json({msg:  error }))
}

const deleteNut = (req: Request, res: Response) => {
  const { nutID } = req.params

  if (!nutID) {
    res.status(500).json({msg: 'No nutID given'})
    return
  }

  prisma.nut.delete({
      where: { id: nutID },
  })
  .then(result => res.status(200).json({ result }))
  .catch(() => res.status(404).json({msg: 'Nut not found'}))
}

export {
  getNuts,
  getNut,
  createNut,
  updateNut,
  deleteNut
}