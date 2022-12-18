"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const helper_1 = require("../utils/helper");
const models_1 = require("../models");
class StreamController {
    constructor(io) {
        this.getData = (req, res) => {
            const streamId = req.query.stream;
            models_1.Stream.findById(streamId)
                .then((stream) => {
                if (!stream) {
                    return res.status(404).json({
                        status: 404,
                        message: 'Стрим не найден',
                        data: null
                    });
                }
                return res.status(200).json({
                    status: 200,
                    message: 'Запрос успешно выполнен',
                    data: stream
                });
            })
                .catch(() => {
                return res.status(500).json({
                    status: 500,
                    message: 'Возникли ошибки при получении данных трансляции',
                    data: null
                });
            });
        };
        this.start = (req, res) => {
            const userId = (0, helper_1.getUserIdFromToken)(req);
            if (typeof userId === 'number') {
                core_1.baseDb.query('SELECT "OwnerId" FROM public."Communities" WHERE "Id" = $1', [req.body.communityId], (error, result) => {
                    var _a;
                    if (error) {
                        return res.status(500).json({
                            status: 500,
                            message: 'Возникли ошибки при обновлении данных сообщества',
                            data: null
                        });
                    }
                    const communityOwnerId = (_a = result === null || result === void 0 ? void 0 : result.rows[0]) === null || _a === void 0 ? void 0 : _a.OwnerId;
                    if (communityOwnerId !== userId) {
                        return res.status(403).json({
                            status: 403,
                            message: 'У вас нет доступа',
                            data: null
                        });
                    }
                    models_1.Stream.find({ communityId: req.body.communityId })
                        .then((obj) => {
                        if (!!obj.length) {
                            return res.status(500).json({
                                status: 500,
                                message: 'Данное сообщество уже ведёт стрим',
                                data: null
                            });
                        }
                        const stream = new models_1.Stream(req.body);
                        stream
                            .save()
                            .then((streamObj) => {
                            core_1.baseDb.query('UPDATE public."Communities" SET "StreamId" = $1 WHERE "Id" = $2', [streamObj.id, req.body.communityId], (error, result) => {
                                if (error) {
                                    return res.status(500).json({
                                        status: 500,
                                        message: 'Возникли ошибки при обновлении данных сообщества',
                                        data: null
                                    });
                                }
                                this.io.emit('COMMUNITY:STREAM_STATUS', {
                                    communityId: req.body.communityId,
                                    isOnline: true
                                });
                                return res.status(200).json({
                                    status: 200,
                                    message: 'Запрос успешно выполнен',
                                    data: streamObj
                                });
                            });
                        })
                            .catch(() => {
                            return res.status(500).json({
                                status: 500,
                                message: 'Возникли ошибки при создании стрима',
                                data: null
                            });
                        });
                    })
                        .catch(() => {
                        return res.status(500).json({
                            status: 500,
                            message: 'Возникли ошибки при создании стрима',
                            data: null
                        });
                    });
                });
            }
            else {
                return res.status(403).json({
                    status: 403,
                    message: 'Вы не авторизованы',
                    data: null
                });
            }
        };
        this.stop = (req, res) => {
            const { communityId, streamId } = req.body;
            const userId = (0, helper_1.getUserIdFromToken)(req);
            core_1.baseDb.query('SELECT "OwnerId" FROM public."Communities" WHERE "Id" = $1', [communityId], (error, result) => {
                var _a;
                if (error) {
                    return res.status(500).json({
                        status: 500,
                        message: 'Возникли ошибки при обновлении данных сообщества',
                        data: null
                    });
                }
                const communityOwnerId = (_a = result === null || result === void 0 ? void 0 : result.rows[0]) === null || _a === void 0 ? void 0 : _a.OwnerId;
                if (communityOwnerId !== userId) {
                    return res.status(403).json({
                        status: 403,
                        message: 'У вас нет доступа',
                        data: null
                    });
                }
                models_1.Stream.findByIdAndDelete(streamId)
                    .then((obj) => {
                    if (!obj) {
                        return res.status(404).json({
                            status: 404,
                            message: 'Данное сообщество не ведёт стрим',
                            data: null
                        });
                    }
                    core_1.baseDb.query('UPDATE public."Communities" SET "StreamId" = $1 WHERE "Id" = $2', ['', communityId], (error, result) => {
                        if (error) {
                            return res.status(500).json({
                                status: 500,
                                message: 'Возникли ошибки при обновлении данных сообщества',
                                data: null
                            });
                        }
                        this.io.emit('COMMUNITY:STREAM_STATUS', {
                            communityId,
                            isOnline: false
                        });
                        return res.status(200).json({
                            status: 200,
                            message: 'Запрос успешно выполнен',
                            data: true
                        });
                    });
                })
                    .catch(() => {
                    return res.status(500).json({
                        status: 500,
                        message: 'Возникли ошибки при остановке стрима',
                        data: null
                    });
                });
            });
        };
        this.io = io;
    }
}
exports.default = StreamController;
