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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectThirdParty = exports.refreshToken = exports.logout = exports.login = exports.signup = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helpers_1 = require("../utils/helpers");
const errors_1 = require("../utils/errors");
const client_1 = require("../libs/client");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty())
        return res.sendStatus(400);
    const hashedPassword = yield (0, helpers_1.hashPassword)(req.body.password);
    try {
        yield client_1.client.user.create({
            data: Object.assign(Object.assign({}, req.body), { username: req.body.username, email: req.body.email.toLowerCase(), password: hashedPassword }),
        });
        return res.status(201);
    }
    catch (err) {
        return (0, errors_1.handleError)(err, res);
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rememberMe } = req.body;
    try {
        const accessToken = (0, helpers_1.generateAccessToken)(req.user);
        const refreshToken = (0, helpers_1.generateRefreshToken)(req.user, rememberMe);
        yield client_1.client.user.update({
            where: { id: req.user.id },
            data: {
                refreshToken: [
                    ...(0, helpers_1.excludeExpiredTokens)(req.user.refreshToken),
                    refreshToken,
                ],
            },
        });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
        res.send({ accessToken });
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('logout');
        yield client_1.client.user.update({
            where: { id: req.user.id },
            data: { refreshToken: [] },
        });
        res.sendStatus(200);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.logout = logout;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
        return res.status(403).send({ error: 'No token given' });
    try {
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(403).send({ error: 'Invalid refresh token' });
            }
            const user = yield client_1.client.user.findFirst({
                where: {
                    id: {
                        equals: decoded.id,
                        mode: 'insensitive',
                    },
                },
            });
            if (!user || !user.refreshToken.includes(refreshToken))
                return res.status(403).send({ error: 'Invalid refresh token' });
            const newAccessToken = (0, helpers_1.generateAccessToken)(user);
            const newRefreshToken = (0, helpers_1.generateRefreshToken)(user, user.rememberMe);
            yield client_1.client.user.update({
                where: { id: req.user.id },
                data: {
                    refreshToken: [
                        ...(0, helpers_1.excludeExpiredTokens)(user.refreshToken),
                        newRefreshToken,
                    ],
                },
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
            });
            res.json({ accessToken: newAccessToken });
        }));
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.refreshToken = refreshToken;
const redirectThirdParty = (_, res) => res.sendStatus(200);
exports.redirectThirdParty = redirectThirdParty;
//# sourceMappingURL=auth.js.map