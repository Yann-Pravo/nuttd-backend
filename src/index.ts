import express from 'express'
import userRouter from './routes/user'
import nutRouter from './routes/nut'

export const app = express()

app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/nuts', nutRouter)

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)
