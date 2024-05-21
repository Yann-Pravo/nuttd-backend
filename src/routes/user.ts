import { Router } from 'express'

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserWithProfile,
  createUserProfile,
  getUserNuts,
} from '../controllers/user'
import { checkSchema } from 'express-validator'
import { createUserSchema } from '../schemas/user'

const router = Router()

router.get('/', getUsers)
router.get('/:userID', getUser)
router.post('/', checkSchema(createUserSchema), createUser)
router.put('/:userID', updateUser)
router.delete('/:userID', deleteUser)

router.post('/:userID/profile', createUserProfile)
router.get('/:userID/profile', getUserWithProfile)

router.get('/:userID/nuts', getUserNuts)

export default router