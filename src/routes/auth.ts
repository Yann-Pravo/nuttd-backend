import express from 'express';
import passport from 'passport';
import { login, getStatus, logout } from '../controllers/auth';

const router = express.Router();

router.post('/login', passport.authenticate(['local']), login)
router.get("/status", getStatus);
router.post("/logout", logout);

export default router;
