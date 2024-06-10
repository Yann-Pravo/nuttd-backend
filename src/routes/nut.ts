import express from 'express'

import {
  getNuts,
  getNut,
  getMyNuts,
  createNut,
  updateNut,
  deleteNut,
  getMyNutsCount,
  getMyNutsRank,
} from '../controllers/nut'

const router = express.Router()

router.get('/', getNuts)
router.post('/', createNut)
router.get('/mynuts', getMyNuts)
router.get('/mynutscount', getMyNutsCount)
router.post('/mynutsrank', getMyNutsRank)
router.get('/:nutID', getNut)
router.put('/:nutID', updateNut)
router.delete('/:nutID', deleteNut)

export default router
