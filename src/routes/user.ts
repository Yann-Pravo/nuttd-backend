import { Router } from 'express'

import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserWithProfile,
  createUserProfile,
  getUserNuts,
} from '../controllers/user'
import { checkIsCurrentUser } from '../utils/middlewares'

const router = Router()

router.get('/', getUsers)
router.get('/:userID', checkIsCurrentUser, getUser)
router.put('/:userID', checkIsCurrentUser, updateUser)
router.delete('/:userID', checkIsCurrentUser, deleteUser)

router.post('/:userID/profile', checkIsCurrentUser, createUserProfile)
router.get('/:userID/profile', checkIsCurrentUser, getUserWithProfile)

router.get('/:userID/nuts', checkIsCurrentUser, getUserNuts)

export default router
