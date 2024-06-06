"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_facebook_1 = require("passport-facebook");
const strategies_1 = require("../utils/strategies");
passport_1.default.serializeUser(strategies_1.serializeUserStrategy);
passport_1.default.deserializeUser(strategies_1.deserializeUserStrategy);
exports.default = passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    callbackURL: process.env.FACEBOOK_CLIENT_REDIRECT_URL || '',
    profileFields: [
        'id',
        'email',
        'displayName',
        'picture',
        'gender',
        'birthday',
    ],
}, (accessToken, refreshToken, profile, done) => {
    var _a, _b;
    const { id, username, displayName, emails, photos, provider, gender, birthday, _json, } = profile;
    (0, strategies_1.verifyStrategy)(accessToken, refreshToken, {
        id,
        displayName: displayName || username,
        email: ((_a = emails === null || emails === void 0 ? void 0 : emails[0]) === null || _a === void 0 ? void 0 : _a.value) || '',
        avatar: ((_b = photos === null || photos === void 0 ? void 0 : photos[0]) === null || _b === void 0 ? void 0 : _b.value) || '',
        gender,
        birthday: birthday || _json.birthday,
        provider,
    }, done);
}));
//# sourceMappingURL=facebook-strategy.js.map