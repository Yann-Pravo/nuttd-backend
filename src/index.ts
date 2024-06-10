import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './routes/user'
import authProfile from './routes/profile'
import nutRouter from './routes/nut'
import authRouter from './routes/auth'
import './strategies/local-strategy'
import './strategies/jwt-strategy'
import './strategies/discord-strategy'
import './strategies/facebook-strategy'
import './strategies/google-strategy'
import { privateRoute } from './utils/middlewares'
import { Ipware } from '@fullerstack/nax-ipware'

const ipware = new Ipware()
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

app.use(
  session({
    secret: process.env.SESSION_SECRET || '',
    saveUninitialized: false,
    resave: false,
  })
)

app.use((req, res, next) => {
  req.ipInfo = ipware.getClientIP(req)
  // { ip: '177.139.100.100', isPublic: true, isRouteTrusted: false }
  // do something with the ip address (e.g. pass it down through the request)
  // note: ip address doesn't change often, so better cache it for performance,
  // you should have distinct session ID for public and anonymous users to cache the ip address
  next()
})

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', authRouter)

app.use(privateRoute)
app.use('/api/users', userRouter)
app.use('/api/profile', authProfile)
app.use('/api/nuts', nutRouter)

app.listen(port, () => console.log(`Server is running on port ${port}`))
