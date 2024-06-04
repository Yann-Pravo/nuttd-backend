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
/* eslint-disable @typescript-eslint/no-explicit-any */
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const client_1 = require("../libs/client");
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};
exports.default = passport_1.default.use(new passport_jwt_1.Strategy(opts, (token, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!token || !token.email || !token.id)
            return done('Token is missing');
        const findUser = yield client_1.client.user.findFirst({
            where: {
                id: {
                    equals: token.id,
                    mode: 'insensitive',
                },
            },
        });
        // if (!findUser.refreshToken.includes(token)) return done('Invalid session')
        done(null, findUser);
    }
    catch (err) {
        done(err, false);
    }
})));
//# sourceMappingURL=jwt-strategy.js.map