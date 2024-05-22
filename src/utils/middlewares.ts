import { Request, Response } from 'express';

export const privateRoute = (req: Request, res: Response, next: any) => {
  if (!req.user)
    return res.sendStatus(401);

  next();
}

export const publicRoute = (req: Request, res: Response, next: any) => {
  if (req.user)
    return res.sendStatus(401);

  next();
}