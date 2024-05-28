"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
const user_1 = __importDefault(require("./routes/user"));
const profile_1 = __importDefault(require("./routes/profile"));
const nut_1 = __importDefault(require("./routes/nut"));
const auth_1 = __importDefault(require("./routes/auth"));
require("./strategies/local-strategy");
require("./strategies/discord-strategy");
require("./strategies/facebook-strategy");
require("./strategies/google-strategy");
const client_1 = require("./libs/client");
const middlewares_1 = require("./utils/middlewares");
exports.app = (0, express_1.default)();
dotenv_1.default.config();
exports.app.use(express_1.default.json());
exports.app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || '',
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    store: new prisma_session_store_1.PrismaSessionStore(client_1.client, {
        // store user sessions in the db
        checkPeriod: 2 * 60 * 1000, //2 min
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    }),
}));
exports.app.use(passport_1.default.initialize());
exports.app.use(passport_1.default.session());
exports.app.use('/api/auth', auth_1.default);
exports.app.use(middlewares_1.privateRoute);
exports.app.use('/api/users', user_1.default);
exports.app.use('/api/profile', profile_1.default);
exports.app.use('/api/nuts', nut_1.default);
exports.app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
//# sourceMappingURL=index.js.map