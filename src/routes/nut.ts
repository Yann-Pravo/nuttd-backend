import express from 'express'

import {
  getNuts,
  getNut,
  getMyNuts,
  createNut,
  updateNut,
  deleteNut,
} from '../controllers/nut'

const router = express.Router()

router.get('/', getNuts)
router.post('/', createNut)
router.get('/mynuts', getMyNuts)
router.get('/:nutID', getNut)
router.put('/:nutID', updateNut)
router.delete('/:nutID', deleteNut)

export default router
