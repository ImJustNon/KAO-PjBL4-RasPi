import dotenv from "dotenv";
import { Config } from "../types/config.type";

dotenv.config();

export const config: Config = {
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
    apiPort: 8800,
    timer: 3 * 60 * 1000,
}