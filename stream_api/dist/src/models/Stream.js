"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StreamSchema = new mongoose_1.Schema({
    key: {
        type: String,
        required: true
    },
    communityId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});
const Stream = (0, mongoose_1.model)('Stream', StreamSchema);
exports.default = Stream;
