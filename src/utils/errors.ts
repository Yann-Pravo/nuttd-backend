import { Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export const handleError = (err: unknown, res: Response) => {
  console.log({ err })
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(400).json({ msg: `${err.meta?.target} already exists` })
    }
    if (err.code === 'P2025') {
      return res.status(404).json(`${err.meta?.modelName} not found`)
    }
  }

  if (err instanceof Error && err.message)
    return res.status(500).json(err.message)

  return res.status(500).json('Something went wrong')
}
