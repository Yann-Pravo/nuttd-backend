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
const auth_1 = require("../../src/controllers/auth");
const client_1 = require("../../src/libs/__mocks__/client");
const authMock_1 = require("../mocks/authMock");
(0, vitest_1.describe)('Auth controller', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.restoreAllMocks();
    });
    vitest_1.vi.mock('../../src/libs/client', () => __awaiter(void 0, void 0, void 0, function* () {
        const actual = yield vitest_1.vi.importActual('../../src/libs/__mocks__/client');
        return Object.assign({}, actual);
    }));
    (0, vitest_1.test)('signup - Should create user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)({
            body: {
                email: 'test@nuttdd.io',
                username: 'usernametest',
                password: 'passwordtest',
            },
        });
        client_1.client.user.create.mockResolvedValue(authMock_1.mockedUser);
        yield (0, auth_1.signup)(req, res);
        (0, vitest_1.expect)(client_1.client.user.create).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(res.statusCode).toBe(201);
    }));
    (0, vitest_1.test)('signup - Should return an error', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)({
            body: {
                email: 'test@nuttdd.io',
                username: 'usernametest',
                password: 'passwordtest',
            },
        });
        client_1.client.user.create.mockRejectedValue(new Error());
        yield (0, auth_1.signup)(req, res);
        (0, vitest_1.expect)(client_1.client.user.create).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(res.statusCode).toBe(500);
        (0, vitest_1.expect)(res._getJSONData()).toEqual('Something went wrong');
    }));
    (0, vitest_1.test)('login - Should return 200', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)();
        yield (0, auth_1.login)(req, res);
        (0, vitest_1.expect)(res.statusCode).toBe(200);
    }));
    (0, vitest_1.test)('getStatus - Should return 401', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)();
        yield (0, auth_1.getStatus)(req, res);
        (0, vitest_1.expect)(res.statusCode).toBe(401);
    }));
    (0, vitest_1.test)('getStatus - Should return 200', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)();
        yield (0, auth_1.getStatus)(req, res);
        (0, vitest_1.expect)(res.statusCode).toBe(401);
    }));
    (0, vitest_1.test)('logout - Should return 200', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)({
            logout: vitest_1.vi.fn().mockImplementation((done) => {
                done();
            }),
        });
        yield (0, auth_1.logout)(req, res);
        (0, vitest_1.expect)(req.logout).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(res.statusCode).toBe(200);
    }));
    (0, vitest_1.test)('logout - Should return 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)({
            logout: vitest_1.vi.fn().mockImplementation((done) => {
                done(new Error());
            }),
        });
        yield (0, auth_1.logout)(req, res);
        (0, vitest_1.expect)(req.logout).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(res.statusCode).toBe(400);
    }));
    (0, vitest_1.test)('redirectThirdParty - Should return 200', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = (0, node_mocks_http_1.createResponse)();
        const req = (0, node_mocks_http_1.createRequest)();
        yield (0, auth_1.redirectThirdParty)(req, res);
        (0, vitest_1.expect)(res.statusCode).toBe(200);
    }));
});
