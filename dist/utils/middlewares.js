"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRoute = exports.privateRoute = void 0;
const privateRoute = (req, res, next) => {
    if (!req.user)
        return res.sendStatus(401);
    next();
};
exports.privateRoute = privateRoute;
const publicRoute = (req, res, next) => {
    if (req.user)
        return res.sendStatus(401);
    next();
};
exports.publicRoute = publicRoute;
//# sourceMappingURL=middlewares.js.map