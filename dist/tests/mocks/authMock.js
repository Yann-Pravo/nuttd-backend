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
    followers: [],
    following: [],
    guilds: [],
    nuts: [],
};
