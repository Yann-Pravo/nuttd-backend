import express from 'express'

import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/users'

const router = express.Router()

router.get('/', getUsers)
router.get('/:userID', getUser)
router.post('/', createUser)
router.put('/:userID', updateUser)
router.delete('/:userID', deleteUser)

export default router