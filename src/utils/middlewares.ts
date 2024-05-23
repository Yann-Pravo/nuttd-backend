import { Request, Response, NextFunction } from 'express'

export const privateRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.sendStatus(401)

  next()
}

export const publicRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user) return res.sendStatus(401)

  next()
}

export const checkIsCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userID } = req.params

  if (!req.user || req.user.id !== userID) return res.sendStatus(401)

  next()
}
