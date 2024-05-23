import { Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export const handleError = (err: unknown, res: Response) => {
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(400).json({ msg: `${err.meta?.target} already exists` })
    }
  }

  return res.status(500).json({ msg: 'Something went wrong' })
}
