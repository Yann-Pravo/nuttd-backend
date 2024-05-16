import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const getNuts = (_: any, res: any) => {
  prisma.nut.findMany()
  .then(result => res.status(200).json({ result }))
  .catch(() => res.status(404).json({msg: 'Nuts not found'}))
}

const getNut = (req: any, res: any) => {
  const { nutId } = req.params

  if (!nutId) {
    res.status(500).json({msg: 'No nutId given'})
    return
  }

  prisma.nut.findUnique({
      where: { id: nutId },
  })
  .then(result => res.status(200).json({ result }))
  .catch(() => res.status(404).json({msg: 'Nut not found'}))
}

const createNut = (req: any, res: any) => {
  prisma.nut.create({ data: req.body })
  .then(result => res.status(200).json({ result }))
  .catch((error) => res.status(500).json({msg:  error }))
}

const updateNut = (req: any, res: any) => {
  const { nutID } = req.params

  if (!nutID) {
    res.status(500).json({msg: 'No nutId given'})
    return
  }

  prisma.nut.update({
    where: { id: nutID },
    data: req.body
  })
  .then(result => res.status(200).json({ result }))
  .catch((error) => res.status(500).json({msg:  error }))
}

const deleteNut = (req: any, res: any) => {
  const { nutID } = req.params

  if (!nutID) {
    res.status(500).json({msg: 'No nutId given'})
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