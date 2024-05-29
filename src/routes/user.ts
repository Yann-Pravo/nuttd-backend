import { Router } from 'express'

import {
  getUsersByUsername,
  getUser,
  changePassword,
  deleteUserWithProfile,
} from '../controllers/user'

const router = Router()

router.get('/list', getUsersByUsername)
router.get('/me', getUser)
router.put('/me/password', changePassword)
router.delete('/me', deleteUserWithProfile)

export default router
