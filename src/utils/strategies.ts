/* eslint-disable @typescript-eslint/no-explicit-any */
import OAuth2Strategy from 'passport-oauth2'
import db from '../../client'
import { getGender } from './helpers'

export const serializeUserStrategy = (
  user: any,
  done: OAuth2Strategy.VerifyCallback
) => {
  done(null, user.id)
}

export const deserializeUserStrategy = async (
  id: string,
  done: OAuth2Strategy.VerifyCallback
) => {
  try {
    const findUser = await db.user.findUnique({ where: { id } })
    if (!findUser) throw new Error('User Not Found')
    done(null, findUser)
  } catch (err) {
    done(err, false)
  }
}

export const verifyStrategy = async (
  accessToken: string,
  refreshToken: string,
  profile: {
    id: string
    username: string
    displayName: string
    email: string
    avatar: string
    gender?: string
    birthday?: string
    provider: string
  },
  done: OAuth2Strategy.VerifyCallback
) => {
  const {
    id,
    username,
    displayName,
    email,
    avatar,
    gender,
    birthday,
    provider,
  } = profile
  let findUser
  try {
    const findThirdParty = await db.thirdParty.findUnique({
      where: { platformId: id },
    })

    if (findThirdParty) {
      findUser = await db.user.findUnique({
        where: { id: findThirdParty?.userId },
      })
    }
  } catch (err) {
    return done(err, false)
  }
  try {
    if (!findUser) {
      const newUser = await db.user.create({
        data: {
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          thirdParty: {
            create: {
              platformId: id,
              provider,
              accessToken,
              refreshToken,
            },
          },
          profile: {
            create: {
              displayName,
              avatar,
              gender: getGender(gender),
              birthday: birthday ? new Date(birthday) : undefined,
            },
          },
        },
      })
      return done(null, newUser)
    }

    return done(null, findUser)
  } catch (err) {
    return done(err, false)
  }
}
