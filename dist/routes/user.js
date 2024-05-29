"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const router = (0, express_1.Router)();
router.get('/list', user_1.getUsersByUsername);
router.get('/me', user_1.getUser);
router.put('/me/password', user_1.changePassword);
router.delete('/me', user_1.deleteUserWithProfile);
exports.default = router;
//# sourceMappingURL=user.js.map