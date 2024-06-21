import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import dotenv from 'dotenv'
import cors from 'cors'
import requestIp from 'request-ip'
import userRouter from './routes/user'
import authProfile from './routes/profile'
import nutRouter from './routes/nut'
import authRouter from './routes/auth'
import guildRouter from './routes/guild'
import locationRouter from './routes/location'
import './strategies/local-strategy'
import './strategies/jwt-strategy'
import './strategies/discord-strategy'
import './strategies/facebook-strategy'
import './strategies/google-strategy'
import { privateRoute } from './utils/middlewares'

const port = process.env.PORT || 3000

const app = express()
dotenv.config()

const corsOptions = {
  origin: process.env.FRONTEND_URL,
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(express.json())
app.use(cookieParser())
app.use(requestIp.mw())

app.use(
  session({
    secret: process.env.SESSION_SECRET || '',
    saveUninitialized: false,
    resave: false,
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', authRouter)

app.use(privateRoute)
app.use('/api/users', userRouter)
app.use('/api/profile', authProfile)
app.use('/api/nuts', nutRouter)
app.use('/api/guilds', guildRouter)
app.use('/api/location', locationRouter)

app.listen(port, () => console.log(`Server is running on port ${port}`))
