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
exports.deleteUserWithProfile = exports.changePassword = exports.getUserById = exports.getUsersByUsername = void 0;
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
            where: {
                username: {
                    contains: filter,
                    mode: 'insensitive',
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
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID } = req.params;
    try {
        const user = yield client_1.client.user.findFirst({
            where: {
                id: {
                    equals: userID,
                    mode: 'insensitive',
                },
            },
            include: {
                profile: true,
                followers: true,
                following: true,
                guilds: true,
                nuts: true,
            },
        });
        if (!user)
            throw new Error('User not found');
        return res.send((0, helpers_1.getPrivateUser)(user));
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.getUserById = getUserById;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userID } = req.params;
    const { oldPassword, newPassword, verifyNewPassword } = req.body;
    try {
        const existingUser = yield client_1.client.user.findFirst({
            where: {
                id: {
                    equals: userID,
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
            where: { id: userID },
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
    const { userID } = req.params;
    try {
        const profile = yield client_1.client.profile.findUnique({
            where: { userId: userID },
        });
        if (profile)
            yield client_1.client.profile.delete({ where: { userId: userID } });
        yield client_1.client.user.delete({ where: { id: userID } });
        res.sendStatus(200);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.deleteUserWithProfile = deleteUserWithProfile;
