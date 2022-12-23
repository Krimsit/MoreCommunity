"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const unauthorizedErrorHandling_1 = __importDefault(require("../middleware/unauthorizedErrorHandling"));
const controllers_1 = require("../controllers");
exports.default = (app, io) => {
    const Stream = new controllers_1.StreamController(io);
    const Message = new controllers_1.MessageController(io);
    app.use((0, cors_1.default)());
    app.use(body_parser_1.default.json());
    app.get('/stream', Stream.getData);
    app.post('/stream/start', unauthorizedErrorHandling_1.default, Stream.start);
    app.post('/stream/stop', unauthorizedErrorHandling_1.default, Stream.stop);
    app.get('/stream/messages', Message.getAll);
    app.post('/stream/messages', unauthorizedErrorHandling_1.default, Message.create);
};
