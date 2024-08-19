"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.SERIAL_PORT || "COM6",
    baudRate: parseInt(process.env.BAUD_RATE || "9600"),
    gpio: {
        redLedPin: 13,
        yellowLedPin: 19,
        greenLedPin: 26,
        buzzerPin: 27,
        alertLedPin: 22,
    },
    lineToken: process.env.LINE_TOKEN || "",
    apiPort: 8800
};
//# sourceMappingURL=config.js.map