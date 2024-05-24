import { Router } from 'express'

import {
  getUsersByUsername,
  getUser,
  changePassword,
  deleteUserWithProfile,
} from '../controllers/user'
import { checkIsCurrentUser } from '../utils/middlewares'

const router = Router()

router.get('/', getUsersByUsername)
router.get('/:userID', checkIsCurrentUser, getUser)
router.put('/:userID/password', checkIsCurrentUser, changePassword)
router.delete('/:userID', checkIsCurrentUser, deleteUserWithProfile)

export default router
