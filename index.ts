import { config } from "./config/config";
import { SerialPort } from "serialport";
import { Gpio } from "onoff";
import { PrismaClient } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { StudentResponseData } from "types/student.type";
import express, { Application } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import { openPort } from "./controllers/OpenPort.controller";
import { DataRecieve } from "./controllers/DataRecieve.controller";
import { ReadError } from "./controllers/ReadError.controller";
import { StartAlert } from "./controllers/StartAlert.controller";

const app: Application = express();
const urlencoded: express.RequestHandler = bodyParser.urlencoded({
    extended: false,
    limit: "50mb"
});
const prisma: PrismaClient = new PrismaClient();
const port: SerialPort = new SerialPort({
    path: config.port,
    baudRate: config.baudRate
});

export const redLed: Gpio = new Gpio(config.gpio.redLedPin, "out");
export const yellowLed: Gpio = new Gpio(config.gpio.yellowLedPin, "out"); 
export const greenLed: Gpio = new Gpio(config.gpio.greenLedPin, "out");
export const buzzer: Gpio = new Gpio(config.gpio.buzzerPin, "out");
export const alertLed: Gpio = new Gpio(config.gpio.alertLedPin, "out");

app.use(cors());
app.use(urlencoded);
app.use(express.json({
    limit: "50mb",
}));
app.use(morgan("dev"));

// default status
redLed.writeSync(1);
yellowLed.writeSync(1);
greenLed.writeSync(1);


port.on('open', openPort);

port.on('data', DataRecieve);

port.on('error', ReadError);

app.post("/api/alert", urlencoded, StartAlert);

app.listen(config.apiPort, (): void =>{
    console.log("> API Service Started At Port : " + String(config.apiPort));
});