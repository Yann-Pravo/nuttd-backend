"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_discord_1 = require("passport-discord");
const strategies_1 = require("../utils/strategies");
passport_1.default.serializeUser(strategies_1.serializeUserStrategy);
passport_1.default.deserializeUser(strategies_1.deserializeUserStrategy);
exports.default = passport_1.default.use(new passport_discord_1.Strategy({
    clientID: process.env.DISCORD_CLIENT_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    callbackURL: process.env.DISCORD_CLIENT_REDIRECT_URL || '',
    scope: ['identify', 'email'],
}, (accessToken, refreshToken, profile, done) => {
    const { id, username, global_name, email, avatar, provider } = profile;
    (0, strategies_1.verifyStrategy)(accessToken, refreshToken, {
        id,
        displayName: global_name || username || '',
        email: email || '',
        avatar: avatar || '',
        provider,
    }, done);
}));
//# sourceMappingURL=discord-strategy.js.map