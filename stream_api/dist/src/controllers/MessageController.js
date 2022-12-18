"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../utils/helper");
const models_1 = require("../models");
class MessageController {
    constructor(io) {
        this.getAll = (req, res) => {
            const streamId = req.query.stream;
            models_1.Message.find({ streamId: streamId })
                .then((messages) => {
                if (!messages) {
                    return res.status(404).json({
                        status: 404,
                        message: 'Сообщения не найдены',
                        data: null
                    });
                }
                return res.status(200).json({
                    status: 200,
                    message: 'Запрос успешно выполнен',
                    data: messages
                });
            })
                .catch(() => {
                return res.status(500).json({
                    status: 500,
                    message: 'Возникли ошибки при получении сообщений',
                    data: null
                });
            });
        };
        this.create = (req, res) => {
            const { room, text, username, streamId } = req.body;
            (0, helper_1.verifyUser)(req, res);
            const postData = {
                text: text,
                username: username,
                streamId: streamId
            };
            const message = new models_1.Message(postData);
            message
                .save()
                .then((messageObj) => {
                this.io.to(room).emit('STREAM:NEW_MESSAGE', { message: messageObj });
                return res.status(200).json({
                    status: 200,
                    message: 'Запрос успешно выполнен',
                    data: messageObj
                });
            })
                .catch((error) => {
                return res.status(500).json({
                    status: 500,
                    message: 'Возникли ошибки при отправке сообщения',
                    data: error.message
                });
            });
        };
        this.io = io;
    }
}
exports.default = MessageController;
