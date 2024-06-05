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

    return res.sendStatus(201)
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

    res.send({ accessToken, refreshToken })
  } catch (err) {
    handleError(err, res)
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
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
  const { refreshToken } = req.body

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
          where: { id: user.id },
          data: {
            refreshToken: [
              ...excludeExpiredTokens(user.refreshToken),
              newRefreshToken,
            ],
          },
        })

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
      }
    )
  } catch (err) {
    handleError(err, res)
  }
}

export const getStatus = (req: Request, res: Response) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  try {
    if (!token) {
      throw new Error()
    }

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = verified as User
    res.send({ isConnected: Boolean(verified) })
  } catch (err) {
    res.send({ isConnected: false })
  }
}

export const redirectThirdParty = (_: Request, res: Response) =>
  res.sendStatus(200)
