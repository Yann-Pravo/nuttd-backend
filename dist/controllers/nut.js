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
const date_fns_1 = require("date-fns");
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
    const { id } = req.user;
    try {
        const nuts = yield client_1.client.nut.findMany({
            take: 30,
            where: {
                userId: id,
            },
            select: {
                id: true,
                date: true,
                comment: true,
                location: {
                    select: {
                        city: true,
                        country: true,
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });
        return res.status(200).json(nuts);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.getMyNuts = getMyNuts;
const getMyNutsPeriodCount = (date, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield client_1.client.nut.count({
            where: {
                userId,
                date: {
                    gte: date,
                },
            },
        });
    }
    catch (err) {
        return err;
    }
});
const getAverageNutsPerDayForQuarters = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const startOfCurrentQuarter = (0, date_fns_1.startOfQuarter)(now);
    const endOfCurrentQuarter = (0, date_fns_1.endOfQuarter)(now);
    const startOfLastQuarter = (0, date_fns_1.startOfQuarter)((0, date_fns_1.subQuarters)(now, 1));
    const endOfLastQuarter = (0, date_fns_1.endOfQuarter)((0, date_fns_1.subQuarters)(now, 1));
    try {
        // Fetch nuts for the current quarter
        const nutsCurrentQuarter = yield client_1.client.nut.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startOfCurrentQuarter,
                    lte: endOfCurrentQuarter,
                },
            },
        });
        // Fetch nuts for the last quarter
        const nutsLastQuarter = yield client_1.client.nut.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startOfLastQuarter,
                    lte: endOfLastQuarter,
                },
            },
        });
        const averageNutsPerDayCurrentQuarter = (0, helpers_1.calculateAverageNutsPerDay)(nutsCurrentQuarter, startOfCurrentQuarter, endOfCurrentQuarter);
        const averageNutsPerDayLastQuarter = (0, helpers_1.calculateAverageNutsPerDay)(nutsLastQuarter, startOfLastQuarter, endOfLastQuarter);
        return {
            currentQuarter: Number(averageNutsPerDayCurrentQuarter.toFixed(2)),
            lastQuarter: Number(averageNutsPerDayLastQuarter.toFixed(2)),
        };
    }
    catch (err) {
        return err;
    }
});
const getNutCountForLast31Days = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const startDate = (0, date_fns_1.subDays)(new Date(), 31);
    try {
        const nutCount = yield client_1.client.nut.count({
            where: {
                userId: userId,
                createdAt: {
                    gte: startDate,
                },
            },
        });
        return nutCount;
    }
    catch (err) {
        return err;
    }
});
const getMyNutsCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const startOfMonthDate = (0, date_fns_1.startOfMonth)(new Date());
    const startOfYearDate = (0, date_fns_1.startOfYear)(new Date());
    try {
        const currentMonthCount = yield getMyNutsPeriodCount(startOfMonthDate, id);
        const currentYearCount = yield getMyNutsPeriodCount(startOfYearDate, id);
        const averageNutPerDayForQuarters = yield getAverageNutsPerDayForQuarters(id);
        const nutCountForLast31Days = yield getNutCountForLast31Days(id);
        return res.status(200).json(Object.assign(Object.assign({ currentMonthCount,
            currentYearCount }, averageNutPerDayForQuarters), { nutCountForLast31Days }));
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.getMyNutsCount = getMyNutsCount;
const getMyNutsRank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
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
            monthRankCity: ((_a = monthRankCity[0]) === null || _a === void 0 ? void 0 : _a.user_rank) || null,
            yearRankCity: ((_b = yearRankCity[0]) === null || _b === void 0 ? void 0 : _b.user_rank) || null,
            monthRankCountry: ((_c = monthRankCountry[0]) === null || _c === void 0 ? void 0 : _c.user_rank) || null,
            yearRankCountry: ((_d = yearRankCountry[0]) === null || _d === void 0 ? void 0 : _d.user_rank) || null,
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
    var _e;
    const { nutID } = req.params;
    const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
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
    var _f;
    const { nutID } = req.params;
    const userId = (_f = req.user) === null || _f === void 0 ? void 0 : _f.id;
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