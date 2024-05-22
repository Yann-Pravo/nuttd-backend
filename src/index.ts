import express from 'express'
import session from 'express-session'
import passport from 'passport'
import dotenv from 'dotenv'
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import userRouter from './routes/user'
import nutRouter from './routes/nut'
import authRouter from './routes/auth';
import './controllers/auth';
import db from '../client';

export const app = express()
dotenv.config()

app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET || '',
    saveUninitialized: false,
    resave: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    store: new PrismaSessionStore( // store user sessions in the db
      db,
      {
        checkPeriod: 2 * 60 * 1000,  //2 min
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
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
