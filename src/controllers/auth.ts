import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { hashPassword } from '../utils/helpers'
import { handleError } from '../utils/errors'
import db from '../../client'

export const signup = async (req: Request, res: Response) => {
  const result = validationResult(req)
  if (!result.isEmpty()) return res.sendStatus(400)

  const hashedPassword = await hashPassword(req.body.password)

  try {
    const user = await db.user.create({
      data: {
        ...req.body,
        username: req.body.username.toLowerCase(),
        email: req.body.email.toLowerCase(),
        password: hashedPassword,
      },
    })

    return res.status(201).send(user)
  } catch (err) {
    return handleError(err, res)
  }
}

export const login = (_: Request, res: Response) => res.sendStatus(200)

export const getStatus = (req: Request, res: Response) => {
  if (req.user) return res.send(req.user)

  return res.sendStatus(401)
}

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.sendStatus(400)
    return res.sendStatus(200)
  })
}

export const redirectDiscord = (_: Request, res: Response) => {
  res.sendStatus(200)
}
