"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const guild_1 = require("../controllers/guild");
const router = express_1.default.Router();
router.post('/', guild_1.createGuild);
router.get('/:guildId', guild_1.getGuild);
exports.default = router;
//# sourceMappingURL=guild.js.map