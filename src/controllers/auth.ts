import { Request, Response } from 'express';

export const login = (_: Request, res: Response) => res.sendStatus(200)

export const getStatus = (req: Request, res: Response) => {
	if (req.user)
    return res.send(req.user)

  return res.sendStatus(401);
}

export const logout = (req: Request, res: Response) => {
	if (!req.user)
    return res.sendStatus(401);

  req.logout(err => {
    if (err) return res.sendStatus(400);
    return res.sendStatus(200);
  })
}