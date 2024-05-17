import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const getUsers = (_: any, res: any) => {
  prisma.user.findMany()
  .then(result => res.status(200).json({ result }))
  .catch(() => res.status(404).json({msg: 'Users not found'}))
}

const getUser = (req: any, res: any) => {
  const { userID } = req.params

  if (!userID) {
    res.status(500).json({msg: 'No userId given'})
    return
  }

  prisma.user.findUnique({
      where: { id: userID },
  })
  .then(result => res.status(200).json({ result }))
  .catch(() => res.status(404).json({msg: 'User not found'}))
}

const createUser = (req: any, res: any) => {
  prisma.user.create({ data: req.body })
  .then(result => res.status(200).json({ result }))
  .catch((error) => res.status(500).json({msg:  error }))
}

const updateUser = (req: any, res: any) => {
  const { userID } = req.params

  if (!userID) {
    res.status(500).json({msg: 'No userId given'})
    return
  }

  prisma.user.update({
    where: { id: userID },
    data: req.body
  })
  .then(result => res.status(200).json({ result }))
  .catch((error) => res.status(500).json({msg:  error }))
}

const deleteUser = (req: any, res: any) => {
  const { userID } = req.params

  if (!userID) {
    res.status(500).json({msg: 'No userId given'})
    return
  }

  prisma.user.delete({
      where: { id: userID },
  })
  .then(result => res.status(200).json({ result }))
  .catch(() => res.status(404).json({msg: 'User not found'}))
}

const createUserProfile = (req: any, res: any) => {
  const { userID } = req.params

  if (!userID) {
    res.status(500).json({msg: 'No userId given'})
    return
  }

  prisma.profile.create({ data: { userId: userID, ...req.body } })
  .then(result => res.status(200).json({ result }))
  .catch(() => res.status(404).json({msg: 'User not found'}))
}

const getUserWithProfile = (req: any, res: any) => {
  const { userID } = req.params

  if (!userID) {
    res.status(500).json({msg: 'No userId given'})
    return
  }

  prisma.user.findUnique({
      where: { id: userID },
      include: { profile: true }
  })
  .then(result => res.status(200).json({ result }))
  .catch(() => res.status(404).json({msg: 'User not found'}))
}

const getUserNuts = (req: any, res: any) => {
  const { userID } = req.params

  if (!userID) {
    res.status(500).json({msg: 'No userId given'})
    return
  }

  prisma.nut.findMany({
      where: { nutterId: userID },
  })
  .then(result => res.status(200).json({ result }))
  .catch(() => res.status(404).json({msg: 'User not found'}))
}

export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  createUserProfile,
  getUserWithProfile,
  getUserNuts
}
