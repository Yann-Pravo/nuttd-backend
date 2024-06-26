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
exports.createProfile = void 0;
const client_1 = require("../libs/client");
const errors_1 = require("../utils/errors");
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    if (!id)
        return res.status(400).json({ msg: 'The id of the user is missing.' });
    try {
        yield client_1.client.profile.create({
            data: Object.assign(Object.assign({}, req.body), { userId: id }),
        });
        return res.sendStatus(200);
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.createProfile = createProfile;
//# sourceMappingURL=profile.js.map