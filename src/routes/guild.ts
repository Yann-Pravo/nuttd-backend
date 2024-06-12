import express from 'express'

import { createGuild, getGuild } from '../controllers/guild'

const router = express.Router()

router.post('/', createGuild)
router.get('/:guildId', getGuild)

export default router
