"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromToken = exports.verifyUser = exports.parseJwt = exports.verifyToken = void 0;
const verifyToken = (token) => token ? token.split(' ')[1] : "";
exports.verifyToken = verifyToken;
const parseJwt = (token) => token ? JSON.parse(atob(token.split('.')[1])) : "";
exports.parseJwt = parseJwt;
const verifyUser = (req, res) => {
    if (!req.headers['authorization']) {
        return res.status(403).json({
            status: 403,
            message: 'Вы не авторизованы',
            data: null
        });
    }
    const jwt = (0, exports.parseJwt)((0, exports.verifyToken)(req.headers['authorization'] || ""));
    if (!jwt) {
        return res.status(403).json({
            status: 403,
            message: 'Вы не авторизованы',
            data: null
        });
    }
};
exports.verifyUser = verifyUser;
const getUserIdFromToken = (req) => {
    const jwt = (0, exports.parseJwt)((0, exports.verifyToken)(req.headers['authorization'] || ""));
    const jwtKeys = Object.keys(jwt);
    return jwt[jwtKeys[0]];
};
exports.getUserIdFromToken = getUserIdFromToken;
