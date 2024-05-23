import { Router } from 'express'

import {
  getUsersByUsername,
  getUser,
  changePassword,
  deleteUserWithProfile,
  createUserProfile,
  getUserNuts,
  createNut,
  updateNut,
  deleteNut,
} from '../controllers/user'
import { checkIsCurrentUser } from '../utils/middlewares'

const router = Router()

router.get('/', getUsersByUsername)
router.get('/:userID', checkIsCurrentUser, getUser)
router.put('/:userID/password', checkIsCurrentUser, changePassword)
router.delete('/:userID', checkIsCurrentUser, deleteUserWithProfile)

router.post('/:userID/profile', checkIsCurrentUser, createUserProfile)

router.get('/:userID/nuts', checkIsCurrentUser, getUserNuts)
router.post('/:userID/nuts', checkIsCurrentUser, createNut)
router.put('/:userID/nuts/:nutID', checkIsCurrentUser, updateNut)
router.delete('/:userID/nuts/:nutID', checkIsCurrentUser, deleteNut)

export default router
