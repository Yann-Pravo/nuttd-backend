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
exports.deleteUserWithProfile = exports.changePassword = exports.getUser = exports.getUsersByUsername = void 0;
const client_1 = require("../libs/client");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const getUsersByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filter } = req.query;
    if (!filter || typeof filter !== 'string' || filter.length < 3)
        return res.status(200).json([]);
    try {
        const users = yield client_1.client.user.findMany({
            take: 10,
            include: {
                profile: {
                    where: {
                        displayName: {
                            contains: filter,
                            mode: 'insensitive',
                        },
                    },
                },
            },
        });
        return res.status(200).json((0, helpers_1.getPublicUsers)(users));
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.getUsersByUsername = getUsersByUsername;
const updateUserLocation = (id, ip) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEOLOCATION_KEY}&ip=${ip}`);
        const location = yield response.json();
        if (location && location.city && location.country_name) {
            const uniqueCityCountry = (0, helpers_1.getUniqueCityCountry)(location.city, location.country_name);
            yield client_1.client.location.update({
                where: {
                    citycountry: uniqueCityCountry,
                },
                data: {
                    latitude: Number(location.latitude),
                    longitude: Number(location.longitude),
                },
            });
            const user = yield client_1.client.user.update({
                where: { id },
                data: {
                    ip,
                    location: {
                        connectOrCreate: {
                            create: {
                                citycountry: uniqueCityCountry,
                                city: location.city,
                                country: location.country_name,
                                countryCode: location.country_code3,
                                countryFlag: location.country_flag,
                                region: location.state_code,
                                regionName: location.state_prov,
                                zip: location.zipcode,
                                latitude: Number(location.latitude),
                                longitude: Number(location.longitude),
                            },
                            where: {
                                citycountry: uniqueCityCountry,
                            },
                        },
                    },
                },
                include: {
                    profile: true,
                    followers: true,
                    following: true,
                    guilds: true,
                    nuts: true,
                    location: true,
                },
            });
            console.log(ip, user.ip);
            return user;
        }
    }
    catch (_a) {
        return null;
    }
});
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                profile: true,
                followers: true,
                following: true,
                guilds: true,
                nuts: true,
                location: true,
            },
        });
        if (!user)
            throw new Error('User not found');
        let updatedUser;
        if (req.clientIp && req.clientIp !== user.ip && user.ip !== 'null') {
            updatedUser = yield updateUserLocation(id, req.clientIp);
        }
        return res.send((0, helpers_1.getPrivateUser)(updatedUser || user));
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.getUser = getUser;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { oldPassword, newPassword, verifyNewPassword } = req.body;
    try {
        const existingUser = yield client_1.client.user.findFirst({
            where: {
                id: {
                    equals: id,
                    mode: 'insensitive',
                },
            },
        });
        if (!existingUser)
            throw new Error('User not found');
        const isMatchOldPassword = yield (0, helpers_1.comparePassword)(oldPassword, existingUser.password || '');
        if (!isMatchOldPassword)
            return res
                .status(400)
                .json('Old password doesn‘t match with the existing one.');
        if (oldPassword === newPassword)
            return res.status(400).json('Old and new passwords are the same.');
        if (newPassword !== verifyNewPassword)
            return res.status(400).json('New passwords don‘t match.');
        const hashedNewPassword = yield (0, helpers_1.hashPassword)(newPassword);
        yield client_1.client.user.update({
            where: { id },
            data: {
                password: hashedNewPassword,
            },
        });
        return res.sendStatus(200);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.changePassword = changePassword;
const deleteUserWithProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    try {
        const profile = yield client_1.client.profile.findUnique({
            where: { userId: id },
        });
        if (profile)
            yield client_1.client.profile.delete({ where: { userId: id } });
        yield client_1.client.user.delete({ where: { id } });
        res.sendStatus(200);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.deleteUserWithProfile = deleteUserWithProfile;
//# sourceMappingURL=user.js.map