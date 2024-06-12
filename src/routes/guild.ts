import express from 'express'

import {
  createGuild,
  getGuild,
  getGuilds,
  joinGuild,
} from '../controllers/guild'

const router = express.Router()

router.get('/', getGuilds)
router.post('/', createGuild)
router.get('/:guildId', getGuild)
router.post('/:guildId', joinGuild)

export default router
