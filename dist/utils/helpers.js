"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUsername = exports.getGender = exports.getPublicNuts = exports.getPublicNut = exports.getPublicUsers = exports.getPublicUser = exports.getPrivateUser = exports.comparePassword = exports.hashPassword = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const hashPassword = (password) => {
    const salt = bcrypt_1.default.genSaltSync(saltRounds);
    return bcrypt_1.default.hashSync(password, salt);
};
exports.hashPassword = hashPassword;
const comparePassword = (plain, hashed) => bcrypt_1.default.compareSync(plain, hashed);
exports.comparePassword = comparePassword;
const getPrivateUser = (user) => {
    const { id, username, email, profile, followers, following, guilds, nuts } = user;
    return {
        id,
        username,
        email,
        displayName: (profile === null || profile === void 0 ? void 0 : profile.displayName) || '',
        birthday: profile === null || profile === void 0 ? void 0 : profile.birthday,
        followers,
        following,
        guilds,
        nuts,
    };
};
exports.getPrivateUser = getPrivateUser;
const getPublicUser = (user) => {
    const { id, username } = user;
    return { id, username };
};
exports.getPublicUser = getPublicUser;
const getPublicUsers = (users) => users.map((user) => (0, exports.getPublicUser)(user));
exports.getPublicUsers = getPublicUsers;
const getPublicNut = (nut) => {
    const { id, date, city, country, coordinates } = nut;
    return { id, date, city, country, coordinates };
};
exports.getPublicNut = getPublicNut;
const getPublicNuts = (nuts) => nuts.map((nut) => (0, exports.getPublicNut)(nut));
exports.getPublicNuts = getPublicNuts;
const getGender = (gender) => {
    if (!gender)
        return null;
    if (gender === 'male')
        return client_1.Gender.MALE;
    if (gender === 'female')
        return client_1.Gender.FEMALE;
};
exports.getGender = getGender;
const generateUsername = (name) => `${name.toLowerCase().replace(/ /g, '')}${Math.floor(Math.random() * 100)}`;
exports.generateUsername = generateUsername;
//# sourceMappingURL=helpers.js.map