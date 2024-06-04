import express from 'express'
import passport from 'passport'
import {
  logout,
  signup,
  redirectThirdParty,
  login,
  refreshToken,
} from '../controllers/auth'
import { publicRoute } from '../utils/middlewares'
import { checkSchema } from 'express-validator'
import { signupSchema } from '../utils/validators'

const router = express.Router()

router.post('/signup', publicRoute, checkSchema(signupSchema), signup)
router.post('/login', passport.authenticate('local'), login)
router.get('/discord', publicRoute, passport.authenticate('discord'))
router.get(
  '/discord/redirect',
  publicRoute,
  passport.authenticate(['discord']),
  redirectThirdParty
)
router.get(
  '/facebook',
  publicRoute,
  passport.authenticate('facebook', {
    scope: ['email', 'user_birthday', 'user_gender'],
  })
)
router.get(
  '/facebook/redirect',
  publicRoute,
  passport.authenticate('facebook'),
  redirectThirdParty
)
router.get(
  '/google',
  publicRoute,
  passport.authenticate(['google'], { scope: ['profile', 'email'] })
)
router.get(
  '/google/redirect',
  publicRoute,
  passport.authenticate(['google']),
  redirectThirdParty
)
router.delete(
  '/logout',
  passport.authenticate('jwt', { session: false }),
  logout
)
router.post('/refresh', refreshToken)

export default router
