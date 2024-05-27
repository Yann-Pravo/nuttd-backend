import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createRequest, createResponse } from 'node-mocks-http'
import { getUserById } from '@/controllers/user'
import { Role } from '@prisma/client'
import { signup } from '@/controllers/auth'

import { client as clientMock } from '@/libs/__mocks__/client'
import { getPrivateUser } from '@/utils/helpers'

const date = new Date()
const mockedUser = {
  id: '1',
  createdAt: date,
  updatedAt: date,
  email: 'test@nuttd.io',
  password: 'password',
  username: 'nuttduser',
  role: Role.USER,
  profile: null,
  followers: [],
  following: [],
  guilds: [],
  nuts: [],
}

describe('[GET] /users/:userID', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  vi.mock('@/libs/client', async () => {
    const actual = await vi.importActual<
      typeof import('@/libs/__mocks__/client')
    >('@/libs/__mocks__/client')
    return {
      ...actual,
    }
  })

  test('[GET] should return 500 User not found', async () => {
    const res = createResponse()
    const req = createRequest({
      method: 'GET',
      url: '/users/1',
      params: { userID: '1' },
    })

    await getUserById(req, res)

    expect(clientMock.user.findFirst).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toEqual('User not found')
  })

  test('[POST] should create user', async () => {
    const res = createResponse()
    const req = createRequest({
      method: 'POST',
      url: '/users',
      body: {
        email: 'test@nuttdd.io',
        username: 'usernametest',
        password: 'passwordtest',
      },
    })

    clientMock.user.create.mockResolvedValue(mockedUser)

    await signup(req, res)

    expect(clientMock.user.create).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(201)
  })

  test('[GET] should return 200 with user', async () => {
    const res = createResponse()
    const req = createRequest({
      method: 'GET',
      url: '/users/1',
      params: { userID: '1' },
    })

    clientMock.user.findFirst.mockResolvedValue(mockedUser)

    await getUserById(req, res)

    expect(clientMock.user.findFirst).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(200)
    expect(res._getData()).toEqual(getPrivateUser(mockedUser))
  })
})
