"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const library_1 = require("@prisma/client/runtime/library");
const handleError = (err, res) => {
    var _a, _b;
    if (err instanceof library_1.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(400).json({ msg: `${(_a = err.meta) === null || _a === void 0 ? void 0 : _a.target} already exists` });
        }
        if (err.code === 'P2025') {
            return res.status(404).json(`${(_b = err.meta) === null || _b === void 0 ? void 0 : _b.modelName} not found`);
        }
    }
    if (err instanceof Error && err.message)
        return res.status(500).json(err.message);
    return res.status(500).json('Something went wrong');
};
exports.handleError = handleError;
