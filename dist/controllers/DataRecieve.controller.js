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
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../index");
const client_1 = require("@prisma/client");
const sendLine_1 = require("../utils/sendLine");
const wait_1 = __importDefault(require("wait"));
const prisma = new client_1.PrismaClient();
let studentSignedOut = false;
let timer;
function startTimer() {
    timer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        const checkRemainingStudent = yield prisma.student.findMany();
        if (checkRemainingStudent.length === 0) {
            console.log("- ✅ | No student left in the car");
            studentSignedOut = false;
            return;
        }
        console.log(`- ⚠ | Found ${checkRemainingStudent.length} Remain in the car`);
        console.table(checkRemainingStudent);
        (0, sendLine_1.sendLine)("HEE!!" + checkRemainingStudent[0].student_id);
        const alertInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            console.log(">>>> ALERTING <<<<");
            index_1.buzzer.writeSync(0);
            index_1.alertLed.writeSync(0);
            yield (0, wait_1.default)(10);
            index_1.buzzer.writeSync(1);
            index_1.alertLed.writeSync(1);
        }), 1000);
        studentSignedOut = false;
        return;
    }), 10000);
}
function DataRecieve(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        console.log(`- Recieved Data : ${data.toString()}`);
        index_1.yellowLed.writeSync(0);
        const scanResult = data.toString();
        if (isNaN(parseInt(scanResult))) {
            index_1.redLed.writeSync(0);
            setTimeout(() => {
                index_1.redLed.writeSync(1);
                index_1.yellowLed.writeSync(1);
            }, 3000);
            return;
        }
        const getStudentInfo = yield axios_1.default.get(`https://kao-pjbl4-backend.vercel.app/api/v1/student/${scanResult}`).catch(e => null);
        const studentResponseData = (_a = getStudentInfo === null || getStudentInfo === void 0 ? void 0 : getStudentInfo.data) !== null && _a !== void 0 ? _a : null;
        if (!studentResponseData) {
            index_1.redLed.writeSync(0);
            setTimeout(() => {
                index_1.redLed.writeSync(1);
                index_1.yellowLed.writeSync(1);
            }, 3000);
            return;
        }
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
                            student_nickname: (_b = studentResponseData.data) === null || _b === void 0 ? void 0 : _b.student_nickname,
                            student_firstname: (_c = studentResponseData.data) === null || _c === void 0 ? void 0 : _c.student_firstname,
                            student_lastname: (_d = studentResponseData.data) === null || _d === void 0 ? void 0 : _d.student_lastname
                        }
                    });
                    yield (0, sendLine_1.sendLine)(`นักเรียนหมายเลข : ${(_e = studentResponseData.data) === null || _e === void 0 ? void 0 : _e.student_id} (${(_f = studentResponseData.data) === null || _f === void 0 ? void 0 : _f.student_nickname} ${(_g = studentResponseData.data) === null || _g === void 0 ? void 0 : _g.student_firstname} ${(_h = studentResponseData.data) === null || _h === void 0 ? void 0 : _h.student_lastname}) ได้ขึ้นรถเเล้วครับ`);
                    index_1.greenLed.writeSync(0);
                    setTimeout(() => {
                        index_1.greenLed.writeSync(1);
                        index_1.yellowLed.writeSync(1);
                    }, 3000);
                }
                else {
                    console.log("- Student ID Not Found");
                    index_1.redLed.writeSync(0);
                    setTimeout(() => {
                        index_1.redLed.writeSync(1);
                        index_1.yellowLed.writeSync(1);
                    }, 3000);
                }
                return;
            }
            else {
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
                yield (0, sendLine_1.sendLine)(`นักเรียนหมายเลข : ${(_j = studentResponseData.data) === null || _j === void 0 ? void 0 : _j.student_id} (${(_k = studentResponseData.data) === null || _k === void 0 ? void 0 : _k.student_nickname} ${(_l = studentResponseData.data) === null || _l === void 0 ? void 0 : _l.student_firstname} ${(_m = studentResponseData.data) === null || _m === void 0 ? void 0 : _m.student_lastname}) ได้ลงรถเเล้วครับ`);
                index_1.greenLed.writeSync(0);
                setTimeout(() => {
                    index_1.greenLed.writeSync(1);
                    index_1.yellowLed.writeSync(1);
                }, 3000);
                if (studentSignedOut === false) {
                    console.log("- Timer Started");
                    startTimer();
                    studentSignedOut = true;
                }
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
//# sourceMappingURL=DataRecieve.controller.js.map