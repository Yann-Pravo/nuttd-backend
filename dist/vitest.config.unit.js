"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        include: ['./tests/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            exclude: [
                'src/index.ts',
                'src/libs/**',
                '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
            ],
        },
    },
});
