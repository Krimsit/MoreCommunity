"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseDb = exports.initRtmp = exports.initRoutes = exports.initSocket = void 0;
var socket_1 = require("./socket");
Object.defineProperty(exports, "initSocket", { enumerable: true, get: function () { return __importDefault(socket_1).default; } });
var routes_1 = require("./routes");
Object.defineProperty(exports, "initRoutes", { enumerable: true, get: function () { return __importDefault(routes_1).default; } });
var rtmp_1 = require("./rtmp");
Object.defineProperty(exports, "initRtmp", { enumerable: true, get: function () { return __importDefault(rtmp_1).default; } });
var baseDb_1 = require("./baseDb");
Object.defineProperty(exports, "baseDb", { enumerable: true, get: function () { return __importDefault(baseDb_1).default; } });
