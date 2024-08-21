"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertLed = exports.buzzer = exports.greenLed = exports.yellowLed = exports.redLed = void 0;
const config_1 = require("./config/config");
const serialport_1 = require("serialport");
const onoff_1 = require("onoff");
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const OpenPort_controller_1 = require("./controllers/OpenPort.controller");
const DataRecieve_controller_1 = require("./controllers/DataRecieve.controller");
const ReadError_controller_1 = require("./controllers/ReadError.controller");
const StartAlert_controller_1 = require("./controllers/StartAlert.controller");
const app = (0, express_1.default)();
const urlencoded = body_parser_1.default.urlencoded({
    extended: false,
    limit: "50mb"
});
const prisma = new client_1.PrismaClient();
const port = new serialport_1.SerialPort({
    path: config_1.config.port,
    baudRate: config_1.config.baudRate
});
exports.redLed = new onoff_1.Gpio(config_1.config.gpio.redLedPin, "out");
exports.yellowLed = new onoff_1.Gpio(config_1.config.gpio.yellowLedPin, "out");
exports.greenLed = new onoff_1.Gpio(config_1.config.gpio.greenLedPin, "out");
exports.buzzer = new onoff_1.Gpio(config_1.config.gpio.buzzerPin, "out");
exports.alertLed = new onoff_1.Gpio(config_1.config.gpio.alertLedPin, "out");
app.use((0, cors_1.default)());
app.use(urlencoded);
app.use(express_1.default.json({
    limit: "50mb",
}));
app.use((0, morgan_1.default)("dev"));
exports.redLed.writeSync(1);
exports.yellowLed.writeSync(1);
exports.greenLed.writeSync(1);
exports.buzzer.writeSync(1);
exports.alertLed.writeSync(1);
port.on('open', OpenPort_controller_1.openPort);
port.on('data', DataRecieve_controller_1.DataRecieve);
port.on('error', ReadError_controller_1.ReadError);
app.post("/api/alert", urlencoded, StartAlert_controller_1.StartAlert);
app.listen(config_1.config.apiPort, () => {
    console.log("> API Service Started At Port : " + String(config_1.config.apiPort));
});
//# sourceMappingURL=index.js.map