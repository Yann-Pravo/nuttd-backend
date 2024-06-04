import { Router } from 'express'

import {
  getUsersByUsername,
  getUser,
  changePassword,
  deleteUserWithProfile,
} from '../controllers/user'
import passport from 'passport'

const router = Router()

router.get('/list', getUsersByUsername)
router.get('/me', passport.authenticate('jwt', { session: false }), getUser)
router.put('/me/password', changePassword)
router.delete('/me', deleteUserWithProfile)

export default router
