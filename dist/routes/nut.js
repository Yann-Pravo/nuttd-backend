"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nut_1 = require("../controllers/nut");
const router = express_1.default.Router();
router.get('/', nut_1.getNuts);
router.post('/', nut_1.createNut);
router.get('/mynuts', nut_1.getMyNuts);
router.get('/mynutscount', nut_1.getMyNutsCount);
router.get('/mynutsrank', nut_1.getMyNutsRank);
router.get('/:nutID', nut_1.getNut);
router.put('/:nutID', nut_1.updateNut);
router.delete('/:nutID', nut_1.deleteNut);
exports.default = router;
//# sourceMappingURL=nut.js.map