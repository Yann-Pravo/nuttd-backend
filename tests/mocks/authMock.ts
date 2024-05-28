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
  followers: [],
  following: [],
  guilds: [],
  nuts: [],
}
