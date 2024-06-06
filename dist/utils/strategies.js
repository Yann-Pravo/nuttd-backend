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
exports.verifyStrategy = exports.deserializeUserStrategy = exports.serializeUserStrategy = void 0;
const client_1 = require("../libs/client");
const helpers_1 = require("./helpers");
const serializeUserStrategy = (user, done) => {
    done(null, user.id);
};
exports.serializeUserStrategy = serializeUserStrategy;
const deserializeUserStrategy = (id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findUser = yield client_1.client.user.findUnique({ where: { id } });
        if (!findUser)
            throw new Error('User Not Found');
        done(null, findUser);
    }
    catch (err) {
        done(err, false);
    }
});
exports.deserializeUserStrategy = deserializeUserStrategy;
const verifyStrategy = (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, displayName, email, avatar, gender, birthday, provider } = profile;
    let findUser;
    try {
        const findThirdParty = yield client_1.client.thirdParty.findUnique({
            where: { platformId: id },
        });
        if (findThirdParty) {
            findUser = yield client_1.client.user.findUnique({
                where: { id: findThirdParty === null || findThirdParty === void 0 ? void 0 : findThirdParty.userId },
            });
        }
    }
    catch (err) {
        return done(err, false);
    }
    try {
        if (!findUser) {
            const newUser = yield client_1.client.user.create({
                data: {
                    email: email.toLowerCase(),
                    thirdParty: {
                        create: {
                            platformId: id,
                            provider,
                            accessToken,
                            refreshToken,
                        },
                    },
                    profile: {
                        create: {
                            displayName,
                            avatar,
                            gender: (0, helpers_1.getGender)(gender),
                            birthday: birthday ? new Date(birthday) : undefined,
                        },
                    },
                },
            });
            return done(null, newUser);
        }
        return done(null, findUser);
    }
    catch (err) {
        return done(err, false);
    }
});
exports.verifyStrategy = verifyStrategy;
//# sourceMappingURL=strategies.js.map