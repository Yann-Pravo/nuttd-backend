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
exports.joinGuild = exports.getGuild = exports.createGuild = exports.getGuilds = void 0;
const client_1 = require("../libs/client");
const errors_1 = require("../utils/errors");
const date_fns_1 = require("date-fns");
const helpers_1 = require("../utils/helpers");
const getGuilds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guilds = yield client_1.client.guild.findMany({
            select: {
                id: true,
                isPrivate: true,
                name: true,
                createdAt: true,
                _count: {
                    select: {
                        users: true,
                    },
                },
            },
        });
        const guildsWithUserCount = guilds.map((guild) => ({
            id: guild.id,
            createdAt: guild.createdAt,
            isPrivate: guild.isPrivate,
            name: guild.name,
            userCount: guild._count.users,
        }));
        res.status(200).json(guildsWithUserCount);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.getGuilds = getGuilds;
const createGuild = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    if (!id)
        return res.status(400).json({ msg: 'The id of the user is missing.' });
    try {
        yield client_1.client.guild.create({
            data: {
                name: req.body.name,
                isPrivate: req.body.isPrivate,
                users: {
                    connect: { id },
                },
                admins: {
                    connect: { id },
                },
            },
        });
        return res.sendStatus(200);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.createGuild = createGuild;
const getGuild = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { guildId } = req.params;
    const startDate = (0, date_fns_1.startOfMonth)(new Date());
    const endDate = (0, date_fns_1.endOfMonth)(new Date());
    try {
        // const guild: PrivateGuild = await client.guild.findUnique({
        const guild = yield client_1.client.guild.findUnique({
            where: { id: guildId },
            select: {
                id: true,
                isPrivate: true,
                name: true,
                users: {
                    select: {
                        id: true,
                        nuts: {
                            where: {
                                date: {
                                    gte: startDate,
                                    lte: endDate,
                                },
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
                        },
                        profile: {
                            select: {
                                displayName: true,
                            },
                        },
                    },
                },
            },
        });
        let nuts = [];
        const usersWithNutsCount = guild.users
            .map((user) => {
            nuts = [
                ...nuts,
                ...user.nuts.map((nut) => ({
                    id: nut.id,
                    date: nut.date,
                    displayName: user.profile.displayName,
                    comment: nut.comment,
                    location: nut.location,
                })),
            ];
            return Object.assign(Object.assign({}, user), { nutsMonthlyCount: user.nuts.length, nuts: undefined });
        })
            .sort((userA, userB) => userB.nutsMonthlyCount < userA.nutsMonthlyCount ? 1 : -1);
        nuts = nuts.sort((nutA, nutB) => (nutB.date > nutA.date ? 1 : -1));
        if (guild)
            return res
                .status(200)
                .json((0, helpers_1.getPrivateGuild)(Object.assign(Object.assign({}, guild), { users: usersWithNutsCount, nuts })));
        return res.sendStatus(404);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.getGuild = getGuild;
const joinGuild = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { guildId } = req.params;
    if (!id)
        return res.status(400).json({ msg: 'The id of the user is missing.' });
    try {
        yield client_1.client.guild.update({
            where: { id: guildId },
            data: {
                users: {
                    connect: { id },
                },
            },
            include: {
                users: true,
            },
        });
        return res.sendStatus(200);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.joinGuild = joinGuild;
//# sourceMappingURL=guild.js.map