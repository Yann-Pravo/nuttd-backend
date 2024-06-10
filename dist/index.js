"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const profile_1 = __importDefault(require("./routes/profile"));
const nut_1 = __importDefault(require("./routes/nut"));
const auth_1 = __importDefault(require("./routes/auth"));
require("./strategies/local-strategy");
require("./strategies/jwt-strategy");
require("./strategies/discord-strategy");
require("./strategies/facebook-strategy");
require("./strategies/google-strategy");
const middlewares_1 = require("./utils/middlewares");
const nax_ipware_1 = require("@fullerstack/nax-ipware");
const ipware = new nax_ipware_1.Ipware();
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
dotenv_1.default.config();
const corsOptions = {
    origin: process.env.FRONTEND_URL,
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || '',
    saveUninitialized: false,
    resave: false,
}));
app.use((req, res, next) => {
    req.ipInfo = ipware.getClientIP(req);
    // { ip: '177.139.100.100', isPublic: true, isRouteTrusted: false }
    // do something with the ip address (e.g. pass it down through the request)
    // note: ip address doesn't change often, so better cache it for performance,
    // you should have distinct session ID for public and anonymous users to cache the ip address
    next();
});
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/api/auth', auth_1.default);
app.use(middlewares_1.privateRoute);
app.use('/api/users', user_1.default);
app.use('/api/profile', profile_1.default);
app.use('/api/nuts', nut_1.default);
app.listen(port, () => console.log(`Server is running on port ${port}`));
//# sourceMappingURL=index.js.map