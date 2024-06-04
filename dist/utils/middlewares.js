"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.publicRoute = exports.privateRoute = void 0;
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.privateRoute = passport_1.default.authenticate('jwt', { session: false });
const publicRoute = (req, res, next) => {
    if (req.isAuthenticated())
        return res.sendStatus(403);
    next();
};
exports.publicRoute = publicRoute;
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    console.log({ token });
    if (!token) {
        return res.status(401).send('Access Denied');
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next();
    }
    catch (err) {
        res.status(400).send('Invalid Token');
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=middlewares.js.map