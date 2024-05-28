import { Role } from '@prisma/client'

const mockDate = new Date()
export const mockedUser = {
  id: '1',
  createdAt: mockDate,
  updatedAt: mockDate,
  email: 'test@nuttd.io',
  password: 'nuttdpassword',
  username: 'nuttduser',
  role: Role.USER,
  profile: {
    id: '1',
    createdAt: mockDate,
    updatedAt: mockDate,
    avatar: null,
    displayName: 'Nuttd user',
    birthday: mockDate,
    gender: null,
    userId: '1',
  },
  followers: [],
  following: [],
  guilds: [],
  nuts: [],
}
