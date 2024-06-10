import { User } from '@prisma/client'

export {}

declare module 'express-serve-static-core' {
  export interface Request {
    user?: User
  }
}
