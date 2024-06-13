import express from 'express'

import { getNutCountByLocation } from '../controllers/location'

const router = express.Router()

router.get('/nutcount', getNutCountByLocation)

export default router
