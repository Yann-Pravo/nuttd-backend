import express from 'express'

import { getNuts, getNut, createNut, updateNut, deleteNut } from '../controllers/nuts'

const router = express.Router()

router.get('/', getNuts)
router.get('/:nutID', getNut)
router.post('/', createNut)
router.put('/:nutID', updateNut)
router.delete('/:nutID', deleteNut)

export default router