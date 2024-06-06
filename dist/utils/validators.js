"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = void 0;
exports.signupSchema = {
    email: {
        isLength: {
            options: {
                min: 3,
                max: 32,
            },
            errorMessage: 'Email must be at least 3 characters',
        },
        notEmpty: {
            errorMessage: 'Email cannot be empty',
        },
        isString: {
            errorMessage: 'Email must be a string!',
        },
    },
    password: {
        isLength: {
            options: {
                min: 8,
                max: 32,
            },
            errorMessage: 'Password must be at least 8 characters',
        },
        notEmpty: {
            errorMessage: 'Password cannot be empty',
        },
        isString: {
            errorMessage: 'Password must be a string!',
        },
    },
};
//# sourceMappingURL=validators.js.map