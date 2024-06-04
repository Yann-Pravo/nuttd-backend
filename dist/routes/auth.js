"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const auth_1 = require("../controllers/auth");
const middlewares_1 = require("../utils/middlewares");
const express_validator_1 = require("express-validator");
const validators_1 = require("../utils/validators");
const router = express_1.default.Router();
router.post('/signup', middlewares_1.publicRoute, (0, express_validator_1.checkSchema)(validators_1.signupSchema), auth_1.signup);
router.post('/login', passport_1.default.authenticate('local'), auth_1.login);
router.get('/discord', middlewares_1.publicRoute, passport_1.default.authenticate('discord'));
router.get('/discord/redirect', middlewares_1.publicRoute, passport_1.default.authenticate(['discord']), auth_1.redirectThirdParty);
router.get('/facebook', middlewares_1.publicRoute, passport_1.default.authenticate('facebook', {
    scope: ['email', 'user_birthday', 'user_gender'],
}));
router.get('/facebook/redirect', middlewares_1.publicRoute, passport_1.default.authenticate('facebook'), auth_1.redirectThirdParty);
router.get('/google', middlewares_1.publicRoute, passport_1.default.authenticate(['google'], { scope: ['profile', 'email'] }));
router.get('/google/redirect', middlewares_1.publicRoute, passport_1.default.authenticate(['google']), auth_1.redirectThirdParty);
router.delete('/logout', passport_1.default.authenticate('jwt', { session: false }), auth_1.logout);
router.post('/refresh', auth_1.refreshToken);
exports.default = router;
//# sourceMappingURL=auth.js.map