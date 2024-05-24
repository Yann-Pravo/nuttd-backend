import { Gender, Guild, Nut, Profile, User } from '@prisma/client'
import bcrypt from 'bcrypt'

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
  const { id, username, email, profile, followers, following, guilds, nuts } =
    user

  return {
    id,
    username,
    email,
    displayName: profile?.displayName || '',
    birthday: profile?.birthday,
    followers,
    following,
    guilds,
    nuts,
  }
}

export const getPublicUser = (user: User) => {
  const { id, username } = user

  return { id, username }
}

export const getPublicUsers = (users: User[]) =>
  users.map((user) => getPublicUser(user))

export const getGender = (gender?: string) => {
  if (!gender) return null
  if (gender === 'male') return Gender.MALE
  if (gender === 'female') return Gender.FEMALE
}

export const generateUsername = (name: string) =>
  `${name.toLowerCase().replace(/ /g, '')}${Math.floor(Math.random() * 100)}`
