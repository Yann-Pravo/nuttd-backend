import express from 'express'
import session from 'express-session'
import passport from 'passport'
import dotenv from 'dotenv'
import userRouter from './routes/user'
import nutRouter from './routes/nut'
import authRouter from './routes/auth';
import './controllers/auth';

export const app = express()
dotenv.config()

app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET || '',
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
)

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter)
app.use('/api/users', userRouter)
app.use('/api/nuts', nutRouter)

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)
