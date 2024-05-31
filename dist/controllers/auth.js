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
exports.redirectThirdParty = exports.logout = exports.getStatus = exports.login = exports.signup = void 0;
const express_validator_1 = require("express-validator");
const helpers_1 = require("../utils/helpers");
const errors_1 = require("../utils/errors");
const client_1 = require("../libs/client");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty())
        return res.sendStatus(400);
    const hashedPassword = yield (0, helpers_1.hashPassword)(req.body.password);
    try {
        yield client_1.client.user.create({
            data: Object.assign(Object.assign({}, req.body), { username: req.body.username, email: req.body.email.toLowerCase(), password: hashedPassword }),
        });
        return res.status(201);
    }
    catch (err) {
        return (0, errors_1.handleError)(err, res);
    }
});
exports.signup = signup;
const login = (_, res) => res.sendStatus(200);
exports.login = login;
const getStatus = (req, res) => {
    if (req.isAuthenticated())
        return res.send('ok');
    return res.send('nok');
};
exports.getStatus = getStatus;
const logout = (req, res) => {
    req.logout((err) => {
        if (err)
            return res.sendStatus(400);
        return res.sendStatus(200);
    });
};
exports.logout = logout;
const redirectThirdParty = (_, res) => res.sendStatus(200);
exports.redirectThirdParty = redirectThirdParty;
//# sourceMappingURL=auth.js.map