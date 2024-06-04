import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'

export const privateRoute = passport.authenticate('jwt', { session: false })

export const publicRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) return res.sendStatus(403)

  next()
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  console.log({ token })

  if (!token) {
    return res.status(401).send('Access Denied')
  }

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = verified as User
    next()
  } catch (err) {
    res.status(400).send('Invalid Token')
  }
}
