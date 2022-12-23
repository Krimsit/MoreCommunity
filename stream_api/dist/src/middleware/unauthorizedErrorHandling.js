"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../utils/helper");
const errorHandler = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(403).json({
            status: 403,
            message: 'Вы не авторизованы',
            data: null
        });
    }
    const jwt = (0, helper_1.parseJwt)((0, helper_1.verifyToken)(req.headers['authorization'] || ""));
    if (!jwt) {
        return res.status(403).json({
            status: 403,
            message: 'Вы не авторизованы',
            data: null
        });
    }
    next();
};
exports.default = errorHandler;
