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
exports.deleteNut = exports.updateNut = exports.createNut = exports.getMyNutsRank = exports.getMyNutsCount = exports.getMyNuts = exports.getNut = exports.getNuts = void 0;
const client_1 = require("../libs/client");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const queries_1 = require("../utils/queries");
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
            where: { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
        });
        return res.status(200).json((0, helpers_1.getPublicNuts)(nuts));
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.getMyNuts = getMyNuts;
const getMyNutsCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    try {
        const currentMonthCount = yield client_1.client.nut.count({
            where: {
                userId: id,
                date: {
                    gte: startOfMonth,
                },
            },
        });
        const currentYearCount = yield client_1.client.nut.count({
            where: {
                userId: id,
                date: {
                    gte: startOfYear,
                },
            },
        });
        return res.status(200).json({ currentMonthCount, currentYearCount });
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.getMyNutsCount = getMyNutsCount;
const getMyNutsRank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    const { id } = req.user;
    try {
        const user = yield client_1.client.user.findFirst({
            where: {
                id: {
                    equals: id,
                    mode: 'insensitive',
                },
            },
            include: {
                location: true,
            },
        });
        if (!user.locationId)
            throw new Error('No location given');
        const userLocation = yield client_1.client.location.findFirst({
            where: {
                id: {
                    equals: user.locationId,
                    mode: 'insensitive',
                },
            },
        });
        if (!userLocation)
            throw new Error('Location not found');
        const monthRankCity = yield (0, queries_1.getUserRankByCityForCurrentMonth)(userLocation.id, id);
        const yearRankCity = yield (0, queries_1.getUserRankByCityForCurrentYear)(userLocation.id, id);
        const monthRankCountry = yield (0, queries_1.getUserRankByCountryForCurrentMonth)(userLocation.countryCode, id);
        const yearRankCountry = yield (0, queries_1.getUserRankByCountryForCurrentYear)(userLocation.countryCode, id);
        return res.status(200).json({
            monthRankCity: ((_b = monthRankCity[0]) === null || _b === void 0 ? void 0 : _b.user_rank) || null,
            yearRankCity: ((_c = yearRankCity[0]) === null || _c === void 0 ? void 0 : _c.user_rank) || null,
            monthRankCountry: ((_d = monthRankCountry[0]) === null || _d === void 0 ? void 0 : _d.user_rank) || null,
            yearRankCountry: ((_e = yearRankCountry[0]) === null || _e === void 0 ? void 0 : _e.user_rank) || null,
        });
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.getMyNutsRank = getMyNutsRank;
const createNut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    if (!id)
        return res.status(400).json({ msg: 'The id of the user is missing.' });
    try {
        const user = yield client_1.client.user.findFirst({
            where: {
                id: {
                    equals: id,
                    mode: 'insensitive',
                },
            },
        });
        yield client_1.client.nut.create({
            data: {
                date: req.body.date,
                comment: req.body.comment,
                user: {
                    connect: { id },
                },
                location: {
                    connect: {
                        id: user.locationId,
                    },
                },
            },
        });
        return res.sendStatus(200);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.createNut = createNut;
const updateNut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const { nutID } = req.params;
    const userId = (_f = req.user) === null || _f === void 0 ? void 0 : _f.id;
    if (!userId)
        return res.status(400).json({ msg: 'The id of the user is missing.' });
    try {
        yield client_1.client.nut.update({
            where: { id: nutID, userId },
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
    var _g;
    const { nutID } = req.params;
    const userId = (_g = req.user) === null || _g === void 0 ? void 0 : _g.id;
    if (!userId)
        return res.status(400).json({ msg: 'The id of the user is missing.' });
    try {
        yield client_1.client.nut.delete({
            where: { id: nutID, userId },
        });
        return res.sendStatus(200);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.deleteNut = deleteNut;
//# sourceMappingURL=nut.js.map