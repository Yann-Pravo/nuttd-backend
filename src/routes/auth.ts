import express from 'express';
import passport from 'passport';
import { login, getStatus, logout, signup } from '../controllers/auth';
import { privateRoute, publicRoute } from '../utils/middlewares';
import { checkSchema } from 'express-validator'
import { createUserSchema } from '../schemas/user'

const router = express.Router();

router.post('/signup', publicRoute, checkSchema(createUserSchema), signup)
router.post('/login', publicRoute, passport.authenticate(['local']), login);
router.get("/status", privateRoute, getStatus);
router.post("/logout", privateRoute, logout);

export default router;
