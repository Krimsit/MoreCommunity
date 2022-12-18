"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(process.env.STREAM_DB_DATA, {}, (err) => {
    if (err)
        throw new Error(`An error occurred while connecting to: ${err.message}`);
    console.log('Connected to Stream DB');
});
