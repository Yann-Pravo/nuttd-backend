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
const vitest_1 = require("vitest");
const node_mocks_http_1 = require("node-mocks-http");
const user_1 = require("../../src/controllers/user");
const client_1 = require("../../src/libs/__mocks__/client");
const helpers_1 = require("../../src/utils/helpers");
const userMocks_1 = require("../mocks/userMocks");
(0, vitest_1.describe)('User controller', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.restoreAllMocks();
    });
    vitest_1.vi.mock('../../src/libs/client', () => __awaiter(void 0, void 0, void 0, function* () {
        const actual = yield vitest_1.vi.importActual('../../src/libs/__mocks__/client');
        return Object.assign({}, actual);
    }));
    (0, vitest_1.test)('getUserById - Should return 500 User not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)({ params: { userID: '1' } });
        yield (0, user_1.getUserById)(req, res);
        (0, vitest_1.expect)(client_1.client.user.findFirst).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(res.statusCode).toBe(500);
        (0, vitest_1.expect)(res._getJSONData()).toEqual('User not found');
    }));
    (0, vitest_1.test)('getUserById - Should return an error', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)({ params: { userID: '1' } });
        client_1.client.user.findFirst.mockRejectedValue(new Error(''));
        yield (0, user_1.getUserById)(req, res);
        (0, vitest_1.expect)(client_1.client.user.findFirst).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(res.statusCode).toBe(500);
        (0, vitest_1.expect)(res._getJSONData()).toEqual('Something went wrong');
    }));
    (0, vitest_1.test)('getUserById - Should get user from id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)({ params: { userID: '1' } });
        client_1.client.user.findFirst.mockResolvedValue(userMocks_1.mockedUser);
        yield (0, user_1.getUserById)(req, res);
        (0, vitest_1.expect)(client_1.client.user.findFirst).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res._getData()).toEqual((0, helpers_1.getPrivateUser)(userMocks_1.mockedUser));
    }));
    (0, vitest_1.test)('getUsersByUsername - Should return an empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)({ query: { filter: 'test' } });
        client_1.client.user.findMany.mockRejectedValue(new Error(''));
        yield (0, user_1.getUsersByUsername)(req, res);
        (0, vitest_1.expect)(client_1.client.user.findMany).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(res.statusCode).toBe(500);
        (0, vitest_1.expect)(res._getJSONData()).toBe('Something went wrong');
    }));
    (0, vitest_1.test)('getUsersByUsername - Should return an array of users', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)({ query: { filter: 'test' } });
        client_1.client.user.findMany.mockResolvedValue([userMocks_1.mockedUser]);
        yield (0, user_1.getUsersByUsername)(req, res);
        (0, vitest_1.expect)(client_1.client.user.findMany).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res._getJSONData()).toEqual((0, helpers_1.getPublicUsers)([userMocks_1.mockedUser]));
    }));
    (0, vitest_1.test)('getUsersByUsername - Should return an empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)({ query: { filter: 'te' } });
        yield (0, user_1.getUsersByUsername)(req, res);
        (0, vitest_1.expect)(client_1.client.user.findMany).toHaveBeenCalledTimes(0);
        (0, vitest_1.expect)(res.statusCode).toBe(200);
        (0, vitest_1.expect)(res._getJSONData()).toEqual((0, helpers_1.getPublicUsers)([]));
    }));
    (0, vitest_1.test)('changePassword - Should change the user‘s password', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)({
            params: { userID: '1' },
            body: {
                oldPassword: userMocks_1.mockedUser.password,
                newPassword: 'newpassword',
                verifyNewPassword: 'newpassword',
            },
        });
        const hashedPassword = yield (0, helpers_1.hashPassword)(userMocks_1.mockedUser.password);
        client_1.client.user.findFirst.mockResolvedValue(Object.assign(Object.assign({}, userMocks_1.mockedUser), { password: hashedPassword }));
        client_1.client.user.update.mockResolvedValue(userMocks_1.mockedUser);
        yield (0, user_1.changePassword)(req, res);
        (0, vitest_1.expect)(client_1.client.user.update).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(res.statusCode).toBe(200);
    }));
    (0, vitest_1.test)('changePassword - Should not change the user‘s password', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)({
            params: { userID: '1' },
            body: {
                oldPassword: userMocks_1.mockedUser.password,
                newPassword: 'newpassword',
                verifyNewPassword: 'newpassword',
            },
        });
        client_1.client.user.findFirst.mockResolvedValue(userMocks_1.mockedUser);
        client_1.client.user.update.mockResolvedValue(userMocks_1.mockedUser);
        yield (0, user_1.changePassword)(req, res);
        (0, vitest_1.expect)(client_1.client.user.update).toHaveBeenCalledTimes(0);
        (0, vitest_1.expect)(res.statusCode).toBe(400);
    }));
    (0, vitest_1.test)('changePassword - Should return an error', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)({
            params: { userID: '1' },
            body: {
                oldPassword: userMocks_1.mockedUser.password,
                newPassword: 'newpassword',
                verifyNewPassword: 'newpassword',
            },
        });
        client_1.client.user.findFirst.mockResolvedValue(null);
        // clientMock.user.update.mockResolvedValue(mockedUser)
        yield (0, user_1.changePassword)(req, res);
        (0, vitest_1.expect)(client_1.client.user.findFirst).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(client_1.client.user.update).toHaveBeenCalledTimes(0);
        (0, vitest_1.expect)(res.statusCode).toBe(500);
        (0, vitest_1.expect)(res._getJSONData()).toBe('User not found');
    }));
    (0, vitest_1.test)('deleteUserWithProfile - Should delete user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)({ params: { userID: '1' } });
        client_1.client.profile.findUnique.mockResolvedValue(userMocks_1.mockedUser.profile);
        yield (0, user_1.deleteUserWithProfile)(req, res);
        (0, vitest_1.expect)(client_1.client.profile.delete).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(client_1.client.user.delete).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(res.statusCode).toBe(200);
    }));
    (0, vitest_1.test)('deleteUserWithProfile - Should return an error', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)({ params: { userID: '1' } });
        client_1.client.user.delete.mockRejectedValue(new Error(''));
        yield (0, user_1.deleteUserWithProfile)(req, res);
        (0, vitest_1.expect)(client_1.client.profile.delete).toHaveBeenCalledTimes(0);
        (0, vitest_1.expect)(client_1.client.user.delete).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(res.statusCode).toBe(500);
        (0, vitest_1.expect)(res._getJSONData()).toBe('Something went wrong');
    }));
});
