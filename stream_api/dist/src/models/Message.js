"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    streamId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Stream',
        required: true
    }
});
const Message = (0, mongoose_1.model)('Message', MessageSchema);
exports.default = Message;
