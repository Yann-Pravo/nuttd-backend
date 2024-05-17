import express from 'express'
import usersRouter from './routes/users'
import nutsRouter from './routes/nuts'

export const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/nuts', nutsRouter)

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)