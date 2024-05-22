import { Request, Response } from 'express';
import {
	validationResult,
	matchedData,
} from "express-validator";
import { hashPassword } from '../utils/helpers';
import { getErrorMessage } from '../utils/errors';
import db from '../../client';

export const signup = async (req: Request, res: Response) => {
  const result = validationResult(req);
	if (!result.isEmpty())
    return res.status(400).send(result.array());

	const data = matchedData(req);
	const hashedPassword = await hashPassword(data.password);

	try {
    const user = await db.user.create({ data: {
      ...req.body,
      password: hashedPassword
    }})

		return res.status(201).send(user);
	} catch (err: any) {
		return res.status(400).json({msg: getErrorMessage(err)});
	}
}

export const login = (_: Request, res: Response) => res.sendStatus(200)

export const getStatus = (req: Request, res: Response) => {
	if (req.user)
    return res.send(req.user)

  return res.sendStatus(401);
}

export const logout = (req: Request, res: Response) => {
  req.logout(err => {
    if (err) return res.sendStatus(400);
    return res.sendStatus(200);
  })
}