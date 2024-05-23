import express from 'express'
import passport from 'passport'
import {
  login,
  getStatus,
  logout,
  signup,
  redirectDiscord,
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
  passport.authenticate(['discord']),
  redirectDiscord
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
  passport.authenticate('facebook'),
  redirectDiscord
)
router.get('/status', privateRoute, getStatus)
router.post('/logout', privateRoute, logout)

export default router
