"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockedUser = void 0;
const client_1 = require("@prisma/client");
const mockDate = new Date();
exports.mockedUser = {
    id: '1',
    createdAt: mockDate,
    updatedAt: mockDate,
    email: 'test@nuttd.io',
    password: 'nuttdpassword',
    username: 'nuttduser',
    role: client_1.Role.USER,
    profile: {
        id: '1',
        createdAt: mockDate,
        updatedAt: mockDate,
        avatar: null,
        displayName: 'Nuttd user',
        birthday: mockDate,
        gender: null,
        userId: '1',
    },
    followers: [],
    following: [],
    guilds: [],
    nuts: [],
};
