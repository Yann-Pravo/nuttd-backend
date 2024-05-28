import express from 'express'
import session from 'express-session'
import passport from 'passport'
import dotenv from 'dotenv'
import { PrismaSessionStore } from '@quixo3/prisma-session-store'
import userRouter from './routes/user'
import authProfile from './routes/profile'
import nutRouter from './routes/nut'
import authRouter from './routes/auth'
import './strategies/local-strategy'
import './strategies/discord-strategy'
import './strategies/facebook-strategy'
import './strategies/google-strategy'
import { client } from './libs/client'
import { privateRoute } from './utils/middlewares'

const app = express()
dotenv.config()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET || '',
    saveUninitialized: false,
    resave: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    store: new PrismaSessionStore(client, {
      // store user sessions in the db
      checkPeriod: 2 * 60 * 1000, //2 min
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', authRouter)

app.use(privateRoute)
app.use('/api/users', userRouter)
app.use('/api/profile', authProfile)
app.use('/api/nuts', nutRouter)

app.listen(port, () => console.log(`Server is running on port ${port}`))
