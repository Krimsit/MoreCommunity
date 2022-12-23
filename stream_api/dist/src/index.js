"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./core/baseDb");
require("./core/db");
const core_1 = require("./core");
const app = (0, express_1.default)();
const http = (0, http_1.createServer)(app);
const io = (0, core_1.initSocket)(http);
(0, core_1.initRoutes)(app, io);
(0, core_1.initRtmp)(io);
http.listen(process.env.STREAM_API_PORT || 3003, () => {
    console.log(`Stream API running is http://localhost:${process.env.STREAM_API_PORT || 3003}`);
});
