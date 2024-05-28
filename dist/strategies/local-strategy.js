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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const client_1 = require("../libs/client");
const helpers_1 = require("../utils/helpers");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findUser = yield client_1.client.user.findUnique({ where: { id } });
        if (!findUser)
            throw new Error('User Not Found');
        done(null, findUser);
    }
    catch (err) {
        done(err, null);
    }
}));
exports.default = passport_1.default.use(new passport_local_1.Strategy({ usernameField: 'email' }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findUser = yield client_1.client.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive',
                },
            },
        });
        if (!findUser)
            throw new Error('Invalid credentials');
        const isMatch = yield (0, helpers_1.comparePassword)(password, findUser.password || '');
        if (!isMatch)
            throw new Error('Invalid credentials');
        done(null, findUser);
    }
    catch (err) {
        done(err, false);
    }
})));
//# sourceMappingURL=local-strategy.js.map