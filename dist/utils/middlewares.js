"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsCurrentUser = exports.publicRoute = exports.privateRoute = void 0;
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
const checkIsCurrentUser = (req, res, next) => {
    const { userID } = req.params;
    if (!req.user || req.user.id !== userID)
        return res.sendStatus(401);
    next();
};
exports.checkIsCurrentUser = checkIsCurrentUser;
//# sourceMappingURL=middlewares.js.map