import { Request, Response } from 'express';
import {
	validationResult,
	matchedData,
} from "express-validator";
import db from '../../client';
import { hashPassword } from '../utils/helpers';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { getErrorMessage } from '../utils/errors';

const getUsers = (_: Request, res: Response) => {
  db.user.findMany()
  .then(result => res.status(200).json({ result }))
  .catch(() => res.status(404).json({msg: 'Users not found'}))
}

const getUser = (req: Request, res: Response) => {
  const { userID } = req.params

  if (!userID) {
    return res.status(500).json({ msg: 'No userId given' });
  }

  db.user.findUnique({
      where: { id: userID },
  })
  .then(result => {
    if (result === null) return res.status(404).json({msg: 'User not found'})

    res.status(200).json({ result })
  })
  .catch(() => res.status(404).json({msg: 'User not found'}))
}

const createUser = async (req: Request, res: Response) => {
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

const updateUser = (req: Request, res: Response) => {
  const { userID } = req.params

  if (!userID) {
    res.status(500).json({msg: 'No userId given'})
    return
  }

  db.user.update({
    where: { id: userID },
    data: req.body
  })
  .then(result => res.status(200).json({ result }))
  .catch((error) => res.status(500).json({msg:  error }))
}

const deleteUser = (req: Request, res: Response) => {
  const { userID } = req.params

  if (!userID) {
    return res.status(500).json({ msg: 'No userId given' });
  }

  db.profile.delete({ where: { userId: userID } })
    .then(() => db.user.delete({ where: { id: userID } })
      .then(result => res.status(200).json({ result }))
      .catch(() => res.status(404).json({msg: 'User not found'}))
    )
}

const createUserProfile = (req: Request, res: Response) => {
  const { userID } = req.params

  if (!userID) {
    res.status(500).json({msg: 'No userId given'})
    return
  }

  db.profile.create({ data: { userId: userID, ...req.body } })
  .then(result => res.status(200).json({ result }))
  .catch(() => res.status(404).json({msg: 'User not found'}))
}

const getUserWithProfile = (req: Request, res: Response) => {
  const { userID } = req.params

  if (!userID) {
    res.status(500).json({msg: 'No userId given'})
    return
  }

  db.user.findUnique({
      where: { id: userID },
      include: { profile: true }
  })
  .then(result => res.status(200).json({ result }))
  .catch(() => res.status(404).json({msg: 'User not found'}))
}

const getUserNuts = (req: Request, res: Response) => {
  const { userID } = req.params

  if (!userID) {
    res.status(500).json({msg: 'No userId given'})
    return
  }

  db.nut.findMany({
      where: { nutterId: userID },
  })
  .then(result => res.status(200).json({ result }))
  .catch(() => res.status(404).json({msg: 'User not found'}))
}

export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  createUserProfile,
  getUserWithProfile,
  getUserNuts
}
