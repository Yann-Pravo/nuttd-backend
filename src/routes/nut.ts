import express from 'express'

import { getNuts, getNut } from '../controllers/nut'

const router = express.Router()

router.get('/', getNuts)
router.get('/:nutID', getNut)

export default router
