import express from 'express'
import passport from 'passport'
import {
  login,
  getStatus,
  logout,
  signup,
  redirectThirdParty,
} from '../controllers/auth'
import { privateRoute, publicRoute } from '../utils/middlewares'
import { checkSchema } from 'express-validator'
import { signupSchema } from '../utils/validators'

const router = express.Router()

router.post('/signup', publicRoute, checkSchema(signupSchema), signup)
router.post('/login', publicRoute, passport.authenticate(['local']), login)
router.get('/discord', publicRoute, passport.authenticate(['discord']))
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
router.get('/status', getStatus)
router.post('/logout', privateRoute, logout)

export default router
