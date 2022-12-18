"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
exports.default = (http) => {
    const io = new socket_io_1.default.Server(http, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        socket.on('STREAM:JOIN', ({ room, username }) => {
            socket.join(room);
            io.to(room).emit('user_joined', {
                username: username
            });
        });
    });
    return io;
};
