"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
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
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT || 3000;
// app.use(
//   cors({
//     credentials: true,
//     origin: true,
//   })
// )
const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
    // optionsSuccessStatus: 200,
};
// Apply CORS middleware first
app.use((0, cors_1.default)(corsOptions));
// Debug middleware to log headers
app.use((req, res, next) => {
    console.log('Request Headers:', req.headers);
    console.log('Response Headers:', res.header);
    next();
});
// Handle preflight requests
app.options('*', (0, cors_1.default)(corsOptions));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE')
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   )
//   res.header('Access-Control-Allow-Credentials', 'true')
//   // Intercept OPTIONS method
//   if (req.method === 'OPTIONS') {
//     res.sendStatus(204)
//   } else {
//     next()
//   }
// })
app.use(express_1.default.json());
// if (process.env.NODE_ENV === "development"){
//   app.use(
//     cors({
//       origin: "https://localhost:3000",
//       credentials: true,
//     })
//   );
// }
// if (process.env.NODE_ENV === "production"){
//   app.use(
//     cors({
//       origin: "https://xyz.onrender.com",
//       credentials: true,
//     })
//   );
// }
app.use((0, express_session_1.default)({
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
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/api/auth', auth_1.default);
app.use(middlewares_1.privateRoute);
app.use('/api/users', user_1.default);
app.use('/api/profile', profile_1.default);
app.use('/api/nuts', nut_1.default);
app.listen(port, () => console.log(`Server is running on port ${port}`));
//# sourceMappingURL=index.js.map