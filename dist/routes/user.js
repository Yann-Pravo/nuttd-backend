"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const middlewares_1 = require("../utils/middlewares");
const router = (0, express_1.Router)();
router.get('/', user_1.getUsersByUsername);
router.get('/:userID', middlewares_1.checkIsCurrentUser, user_1.getUserById);
router.put('/:userID/password', middlewares_1.checkIsCurrentUser, user_1.changePassword);
router.delete('/:userID', middlewares_1.checkIsCurrentUser, user_1.deleteUserWithProfile);
exports.default = router;
//# sourceMappingURL=user.js.map