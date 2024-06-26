"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAverageNutsPerDay = exports.getUniqueCityCountry = exports.excludeExpiredTokens = exports.generateRefreshToken = exports.generateAccessToken = exports.getGender = exports.getPrivateGuild = exports.getPublicNuts = exports.getPublicNut = exports.getPublicUsers = exports.getPublicUser = exports.getPrivateUser = exports.comparePassword = exports.hashPassword = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const date_fns_1 = require("date-fns");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const saltRounds = 10;
const hashPassword = (password) => {
    const salt = bcrypt_1.default.genSaltSync(saltRounds);
    return bcrypt_1.default.hashSync(password, salt);
};
exports.hashPassword = hashPassword;
const comparePassword = (plain, hashed) => bcrypt_1.default.compareSync(plain, hashed);
exports.comparePassword = comparePassword;
const getPrivateUser = (user) => {
    const { id, email, profile, location, followers, following, guilds, nuts } = user;
    return {
        id,
        email,
        profile,
        location,
        followers,
        following,
        guilds,
        nuts,
    };
};
exports.getPrivateUser = getPrivateUser;
const getPublicUser = (user) => {
    const { id, profile } = user;
    return { id, displayName: (profile === null || profile === void 0 ? void 0 : profile.displayName) || '' };
};
exports.getPublicUser = getPublicUser;
const getPublicUsers = (users) => users.map((user) => (0, exports.getPublicUser)(user));
exports.getPublicUsers = getPublicUsers;
const getPublicNut = (nut) => {
    const { id, date, locationId } = nut;
    return { id, date, locationId };
};
exports.getPublicNut = getPublicNut;
const getPublicNuts = (nuts) => nuts.map((nut) => (0, exports.getPublicNut)(nut));
exports.getPublicNuts = getPublicNuts;
const getPrivateGuild = (guild) => {
    const { id, isPrivate, name, users, nuts } = guild;
    return { id, isPrivate, name, users, nuts };
};
exports.getPrivateGuild = getPrivateGuild;
const getGender = (gender) => {
    if (!gender)
        return null;
    if (gender === 'male')
        return client_1.Gender.MALE;
    if (gender === 'female')
        return client_1.Gender.FEMALE;
};
exports.getGender = getGender;
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user, rememberMe) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: rememberMe ? '7d' : '1d',
    });
};
exports.generateRefreshToken = generateRefreshToken;
const excludeExpiredTokens = (tokens) => tokens.filter((token) => {
    const decoded = jsonwebtoken_1.default.decode(token);
    return decoded && decoded.exp && new Date(decoded.exp * 1000) > new Date();
});
exports.excludeExpiredTokens = excludeExpiredTokens;
const getUniqueCityCountry = (city, country) => `${city}-${country}`;
exports.getUniqueCityCountry = getUniqueCityCountry;
const calculateAverageNutsPerDay = (nuts, start, end) => {
    const days = (0, date_fns_1.eachDayOfInterval)({ start, end });
    const totalDays = days.length;
    const totalNuts = nuts.length;
    const average = totalNuts / totalDays;
    return average;
};
exports.calculateAverageNutsPerDay = calculateAverageNutsPerDay;
//# sourceMappingURL=helpers.js.map