import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { hashPassword } from '../utils/helpers'
import { handleError } from '../utils/errors'
import { client } from '../libs/client'

export const signup = async (req: Request, res: Response) => {
  const result = validationResult(req)
  if (!result.isEmpty()) return res.sendStatus(400)

  const hashedPassword = await hashPassword(req.body.password)

  try {
    await client.user.create({
      data: {
        ...req.body,
        username: req.body.username,
        email: req.body.email.toLowerCase(),
        password: hashedPassword,
      },
    })

    return res.status(201)
  } catch (err) {
    return handleError(err, res)
  }
}

export const login = (_: Request, res: Response) => res.sendStatus(200)

export const getStatus = (req: Request, res: Response) => {
  if (req.user) return res.sendStatus(200)

  return res.sendStatus(401)
}

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.sendStatus(400)
    return res.sendStatus(200)
  })
}

export const redirectThirdParty = (_: Request, res: Response) =>
  res.sendStatus(200)
