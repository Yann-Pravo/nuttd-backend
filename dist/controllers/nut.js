"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNut = exports.updateNut = exports.createNut = exports.getMyNuts = exports.getNut = exports.getNuts = void 0;
const client_1 = require("../libs/client");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const getNuts = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nuts = yield client_1.client.nut.findMany();
        res.status(200).json((0, helpers_1.getPublicNuts)(nuts));
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.getNuts = getNuts;
const getNut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nutID } = req.params;
    try {
        const nut = yield client_1.client.nut.findUnique({
            where: { id: nutID },
        });
        if (nut)
            return res.status(200).json((0, helpers_1.getPublicNut)(nut));
        return res.sendStatus(404);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.getNut = getNut;
const getMyNuts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const nuts = yield client_1.client.nut.findMany({
            where: { nutterId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
        });
        return res.status(200).json((0, helpers_1.getPublicNuts)(nuts));
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.getMyNuts = getMyNuts;
const createNut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    if (!userId)
        return res.status(400).json({ msg: 'The id of the user is missing.' });
    try {
        yield client_1.client.nut.create({
            data: Object.assign(Object.assign({}, req.body), { nutterId: userId }),
        });
        return res.sendStatus(200);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.createNut = createNut;
const updateNut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { nutID } = req.params;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
    if (!userId)
        return res.status(400).json({ msg: 'The id of the user is missing.' });
    try {
        yield client_1.client.nut.update({
            where: { id: nutID, nutterId: userId },
            data: req.body,
        });
        return res.sendStatus(200);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.updateNut = updateNut;
const deleteNut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { nutID } = req.params;
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    if (!userId)
        return res.status(400).json({ msg: 'The id of the user is missing.' });
    try {
        yield client_1.client.nut.delete({
            where: { id: nutID, nutterId: userId },
        });
        return res.sendStatus(200);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.deleteNut = deleteNut;
//# sourceMappingURL=nut.js.map