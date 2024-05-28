import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createRequest, createResponse } from 'node-mocks-http'
import {
  changePassword,
  deleteUserWithProfile,
  getUserById,
  getUsersByUsername,
} from '../../src/controllers/user'

import { client as clientMock } from '../../src/libs/__mocks__/client'
import {
  getPrivateUser,
  getPublicUsers,
  hashPassword,
} from '../../src/utils/helpers'
import { mockedUser } from '../mocks/userMocks'

describe('User controller', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  vi.mock('../../src/libs/client', async () => {
    const actual = await vi.importActual<
      typeof import('../../src/libs/__mocks__/client')
    >('../../src/libs/__mocks__/client')
    return {
      ...actual,
    }
  })

  test('getUserById - Should return 500 User not found', async () => {
    const res = createResponse()
    const req = createRequest({ params: { userID: '1' } })

    await getUserById(req, res)

    expect(clientMock.user.findFirst).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toEqual('User not found')
  })

  test('getUserById - Should return an error', async () => {
    const res = createResponse()
    const req = createRequest({ params: { userID: '1' } })

    clientMock.user.findFirst.mockRejectedValue(new Error(''))

    await getUserById(req, res)

    expect(clientMock.user.findFirst).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toEqual('Something went wrong')
  })

  test('getUserById - Should get user from id', async () => {
    const res = createResponse()
    const req = createRequest({ params: { userID: '1' } })

    clientMock.user.findFirst.mockResolvedValue(mockedUser)

    await getUserById(req, res)

    expect(clientMock.user.findFirst).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(200)
    expect(res._getData()).toEqual(getPrivateUser(mockedUser))
  })

  test('getUsersByUsername - Should return an empty array', async () => {
    const res = createResponse()
    const req = createRequest({ query: { filter: 'test' } })

    clientMock.user.findMany.mockRejectedValue(new Error(''))

    await getUsersByUsername(req, res)

    expect(clientMock.user.findMany).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toBe('Something went wrong')
  })

  test('getUsersByUsername - Should return an array of users', async () => {
    const res = createResponse()
    const req = createRequest({ query: { filter: 'test' } })

    clientMock.user.findMany.mockResolvedValue([mockedUser])

    await getUsersByUsername(req, res)

    expect(clientMock.user.findMany).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toEqual(getPublicUsers([mockedUser]))
  })

  test('getUsersByUsername - Should return an empty array', async () => {
    const res = createResponse()
    const req = createRequest({ query: { filter: 'te' } })

    await getUsersByUsername(req, res)

    expect(clientMock.user.findMany).toHaveBeenCalledTimes(0)
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toEqual(getPublicUsers([]))
  })

  test('changePassword - Should change the user‘s password', async () => {
    const res = createResponse()
    const req = createRequest({
      params: { userID: '1' },
      body: {
        oldPassword: mockedUser.password,
        newPassword: 'newpassword',
        verifyNewPassword: 'newpassword',
      },
    })
    const hashedPassword = await hashPassword(mockedUser.password)

    clientMock.user.findFirst.mockResolvedValue({
      ...mockedUser,
      password: hashedPassword,
    })
    clientMock.user.update.mockResolvedValue(mockedUser)

    await changePassword(req, res)

    expect(clientMock.user.update).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(200)
  })

  test('changePassword - Should not change the user‘s password', async () => {
    const res = createResponse()
    const req = createRequest({
      params: { userID: '1' },
      body: {
        oldPassword: mockedUser.password,
        newPassword: 'newpassword',
        verifyNewPassword: 'newpassword',
      },
    })

    clientMock.user.findFirst.mockResolvedValue(mockedUser)
    clientMock.user.update.mockResolvedValue(mockedUser)

    await changePassword(req, res)

    expect(clientMock.user.update).toHaveBeenCalledTimes(0)
    expect(res.statusCode).toBe(400)
  })

  test('changePassword - Should return an error', async () => {
    const res = createResponse()
    const req = createRequest({
      params: { userID: '1' },
      body: {
        oldPassword: mockedUser.password,
        newPassword: 'newpassword',
        verifyNewPassword: 'newpassword',
      },
    })

    clientMock.user.findFirst.mockResolvedValue(null)
    // clientMock.user.update.mockResolvedValue(mockedUser)

    await changePassword(req, res)

    expect(clientMock.user.findFirst).toHaveBeenCalledOnce()
    expect(clientMock.user.update).toHaveBeenCalledTimes(0)
    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toBe('User not found')
  })

  test('deleteUserWithProfile - Should delete user', async () => {
    const res = createResponse()
    const req = createRequest({ params: { userID: '1' } })

    clientMock.profile.findUnique.mockResolvedValue(mockedUser.profile)

    await deleteUserWithProfile(req, res)

    expect(clientMock.profile.delete).toHaveBeenCalledOnce()
    expect(clientMock.user.delete).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(200)
  })

  test('deleteUserWithProfile - Should return an error', async () => {
    const res = createResponse()
    const req = createRequest({ params: { userID: '1' } })

    clientMock.user.delete.mockRejectedValue(new Error(''))

    await deleteUserWithProfile(req, res)

    expect(clientMock.profile.delete).toHaveBeenCalledTimes(0)
    expect(clientMock.user.delete).toHaveBeenCalledOnce()
    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toBe('Something went wrong')
  })
})
