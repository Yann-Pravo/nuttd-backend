import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import {
  excludeExpiredTokens,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
} from '../utils/helpers'
import { handleError } from '../utils/errors'
import { client } from '../libs/client'
import { User } from '@prisma/client'

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

export const login = async (req: Request, res: Response) => {
  const { rememberMe } = req.body

  try {
    const accessToken = generateAccessToken(req.user)
    const refreshToken = generateRefreshToken(req.user, rememberMe)

    await client.user.update({
      where: { id: req.user.id },
      data: {
        refreshToken: [
          ...excludeExpiredTokens(req.user.refreshToken),
          refreshToken,
        ],
      },
    })

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
    res.send({ accessToken })
  } catch (err) {
    handleError(err, res)
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    console.log('logout')
    await client.user.update({
      where: { id: req.user.id },
      data: { refreshToken: [] },
    })

    res.sendStatus(200)
  } catch (err) {
    handleError(err, res)
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies

  if (!refreshToken) return res.status(403).send({ error: 'No token given' })

  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err: VerifyErrors | null, decoded: User) => {
        if (err) {
          return res.status(403).send({ error: 'Invalid refresh token' })
        }

        const user = await client.user.findFirst({
          where: {
            id: {
              equals: decoded.id,
              mode: 'insensitive',
            },
          },
        })

        if (!user || !user.refreshToken.includes(refreshToken))
          return res.status(403).send({ error: 'Invalid refresh token' })

        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user, user.rememberMe)

        await client.user.update({
          where: { id: req.user.id },
          data: {
            refreshToken: [
              ...excludeExpiredTokens(user.refreshToken),
              newRefreshToken,
            ],
          },
        })

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
        })
        res.json({ accessToken: newAccessToken })
      }
    )
  } catch (err) {
    handleError(err, res)
  }
}

export const redirectThirdParty = (_: Request, res: Response) =>
  res.sendStatus(200)
