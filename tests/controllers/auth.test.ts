import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createRequest, createResponse } from 'node-mocks-http'
import {
  getStatus,
  login,
  logout,
  redirectThirdParty,
  signup,
} from '@/controllers/auth'

import { client as clientMock } from '@/libs/__mocks__/client'
import { mockedUser } from 'tests/mocks/authMock'

describe('Auth controller', () => {
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

  test('signup - Should create user', async () => {
    const res = createResponse()
    const req = createRequest({
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

  test('signup - Should return an error', async () => {
    const res = createResponse()
    const req = createRequest({
      body: {
        email: 'test@nuttdd.io',
        username: 'usernametest',
        password: 'passwordtest',
      },
    })

    clientMock.user.create.mockRejectedValue(new Error())

    await signup(req, res)

    expect(clientMock.user.create).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toEqual('Something went wrong')
  })

  test('login - Should return 200', async () => {
    const res = createResponse()
    const req = createRequest()

    await login(req, res)

    expect(res.statusCode).toBe(200)
  })

  test('getStatus - Should return 401', async () => {
    const res = createResponse()
    const req = createRequest()

    await getStatus(req, res)

    expect(res.statusCode).toBe(401)
  })

  test('getStatus - Should return 200', async () => {
    const res = createResponse()
    const req = createRequest()

    await getStatus(req, res)

    expect(res.statusCode).toBe(401)
  })

  test('logout - Should return 200', async () => {
    const res = createResponse()
    const req = createRequest({
      logout: vi.fn().mockImplementation((done) => {
        done()
      }),
    })

    await logout(req, res)

    expect(req.logout).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(200)
  })

  test('logout - Should return 400', async () => {
    const res = createResponse()
    const req = createRequest({
      logout: vi.fn().mockImplementation((done) => {
        done(new Error())
      }),
    })

    await logout(req, res)

    expect(req.logout).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(400)
  })

  test('redirectThirdParty - Should return 200', async () => {
    const res = createResponse()
    const req = createRequest()

    await redirectThirdParty(req, res)

    expect(res.statusCode).toBe(200)
  })
})
