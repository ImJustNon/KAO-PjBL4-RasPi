"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataRecieve = DataRecieve;
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
const index_1 = require("../index");
const prisma = new client_1.PrismaClient();
function DataRecieve(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        index_1.yellowLed.writeSync(0);
        const scanResult = data.toString();
        console.log(`Recieve Data : ${scanResult}`);
        if (isNaN(parseInt(scanResult))) {
            index_1.redLed.writeSync(0);
            setTimeout(() => {
                index_1.redLed.writeSync(1);
                index_1.yellowLed.writeSync(1);
            }, 3000);
            return;
        }
        const getStudentInfo = yield axios_1.default.get(`https://kao-pjbl4-backend.vercel.app/api/v1/student/${scanResult}`).catch(e => null);
        const studentResponseData = getStudentInfo === null || getStudentInfo === void 0 ? void 0 : getStudentInfo.data;
        try {
            const checkCurrentData = yield prisma.student.findFirst({
                where: {
                    student_id: scanResult
                }
            });
            if (!checkCurrentData) {
                if (studentResponseData.status === "OK") {
                    yield prisma.student.create({
                        data: {
                            student_id: scanResult,
                            student_nickname: (_a = studentResponseData.data) === null || _a === void 0 ? void 0 : _a.student_nickname,
                            student_firstname: (_b = studentResponseData.data) === null || _b === void 0 ? void 0 : _b.student_firstname,
                            student_lastname: (_c = studentResponseData.data) === null || _c === void 0 ? void 0 : _c.student_lastname
                        }
                    });
                }
                else {
                    yield prisma.student.create({
                        data: {
                            student_id: scanResult,
                        }
                    });
                }
                index_1.greenLed.writeSync(0);
                setTimeout(() => {
                    index_1.greenLed.writeSync(1);
                    index_1.yellowLed.writeSync(1);
                }, 3000);
                return;
            }
            else {
                yield axios_1.default.post("https://notify-api.line.me/api/notify", `message=เด็กเหี้ย : ${checkCurrentData.student_id} (${checkCurrentData.student_nickname} ${checkCurrentData.student_firstname} ${checkCurrentData.student_lastname}) ได้ลงรถเเล้วจ้าาาา`, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${config_1.config.lineToken}`,
                    },
                });
                yield prisma.history.create({
                    data: {
                        student_id: checkCurrentData.student_id,
                        student_firstname: checkCurrentData.student_firstname,
                        student_lastname: checkCurrentData.student_lastname,
                        student_nickname: checkCurrentData.student_nickname,
                        geton_at: checkCurrentData.created_at,
                        getoff_at: String(new Date().toISOString())
                    }
                });
                yield prisma.student.deleteMany({
                    where: {
                        student_id: checkCurrentData.student_id
                    }
                });
                index_1.greenLed.writeSync(0);
                setTimeout(() => {
                    index_1.greenLed.writeSync(1);
                    index_1.yellowLed.writeSync(1);
                }, 3000);
                return;
            }
        }
        catch (e) {
            index_1.redLed.writeSync(0);
            setTimeout(() => {
                index_1.redLed.writeSync(1);
                index_1.yellowLed.writeSync(1);
            }, 3000);
            return;
        }
    });
}
//# sourceMappingURL=old_DataRecieve.controller.js.map