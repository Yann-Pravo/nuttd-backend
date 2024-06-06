import { Gender, Guild, Nut, Profile, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface FullUser extends User {
  profile: Profile | null
  followers: User[]
  following: User[]
  guilds: Guild[]
  nuts: Nut[]
}

const saltRounds = 10

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(saltRounds)
  return bcrypt.hashSync(password, salt)
}

export const comparePassword = (plain: string, hashed: string) =>
  bcrypt.compareSync(plain, hashed)

export const getPrivateUser = (user: FullUser) => {
  const { id, email, profile, followers, following, guilds, nuts } = user

  return {
    id,
    email,
    displayName: profile?.displayName || '',
    birthday: profile?.birthday,
    followers,
    following,
    guilds,
    nuts,
  }
}

export const getPublicUser = (user: Pick<FullUser, 'id' | 'profile'>) => {
  const { id, profile } = user

  return { id, displayName: profile?.displayName || '' }
}

export const getPublicUsers = (users: Pick<FullUser, 'id' | 'profile'>[]) =>
  users.map((user) => getPublicUser(user))

export const getPublicNut = (nut: Nut) => {
  const { id, date, city, country, coordinates } = nut

  return { id, date, city, country, coordinates }
}

export const getPublicNuts = (nuts: Nut[]) =>
  nuts.map((nut) => getPublicNut(nut))

export const getGender = (gender?: string) => {
  if (!gender) return null
  if (gender === 'male') return Gender.MALE
  if (gender === 'female') return Gender.FEMALE
}

export const generateAccessToken = (user: User) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  )
}

export const generateRefreshToken = (user: User, rememberMe?: boolean) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: rememberMe ? '7d' : '1d',
    }
  )
}

export const excludeExpiredTokens = (tokens: string[]) =>
  tokens.filter((token) => {
    const decoded = jwt.decode(token) as jwt.JwtPayload
    return decoded && decoded.exp && new Date(decoded.exp * 1000) > new Date()
  })
