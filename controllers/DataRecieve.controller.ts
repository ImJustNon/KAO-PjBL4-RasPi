import axios, { AxiosResponse } from "axios";
import { alertLed, buzzer, greenLed, redLed, yellowLed } from "../index";
import { StudentResponseData } from "../types/student.type";
import { PrismaClient } from "@prisma/client";
import { config } from "../config/config";
import { sendLine } from "../utils/sendLine";
import wait from "wait";

const prisma: PrismaClient = new PrismaClient();

let studentSignedOut: boolean = false;
let timer: NodeJS.Timeout;
let alert: boolean = false;
function startTimer(){
    timer = setTimeout(async() =>{
        const checkRemainingStudent = await prisma.student.findMany();
        if(checkRemainingStudent.length === 0){
            console.log("- ✅ | No student left in the car");
            studentSignedOut = false;
            clearTimeout(timer);
            return;
        }
        console.log(`- ⚠ | Found ${checkRemainingStudent.length} Remain in the car`);
        console.table(checkRemainingStudent);
        
        // alert zone
        for(let i = 0; i < checkRemainingStudent.length; i++){
            await sendLine(`พบนักเรียนทีไม่ได้สเเกนบัตรออกรถ!!! ${checkRemainingStudent[i].student_id} (${checkRemainingStudent[i].student_nickname} ${checkRemainingStudent[i].student_firstname} ${checkRemainingStudent[i].student_lastname})`);
        }
        
        buzzer.writeSync(0);
        alert = true;
        while(alert){
            const checkRemaining = await prisma.student.count();
            if(checkRemaining === 0){
                stopAlert();
                break;
            }
            console.log(">>>> ALERTING <<<<");
            alertLed.writeSync(0);
            await wait(250);
            alertLed.writeSync(1);
            await wait(100);
        }

        studentSignedOut = false;
        return;
    }, config.timer);
}

function stopAlert(){
    clearTimeout(timer);
    alert = false;
    studentSignedOut = false;
    buzzer.writeSync(1);
}

export async function DataRecieve(data: Buffer): Promise<void> {
    // Debug
    console.log(`- Recieved Data : ${data.toString()}`);
    // Yellow LED sign mean it is processing
    yellowLed.writeSync(0);


    const scanResult: string = data.toString();

    if(scanResult.replace("\r", "") === "RESET"){
        stopAlert();
        // reset database
        await prisma.student.deleteMany();
        return;
    }

    if(isNaN(parseInt(scanResult))){
        redLed.writeSync(0);
        setTimeout(() => {
            redLed.writeSync(1);
            yellowLed.writeSync(1);
        }, 3000);
        return;
    }

    const getStudentInfo: AxiosResponse<StudentResponseData, any> | null = await axios.get(`https://kao-pjbl4-backend.vercel.app/api/v1/student/${scanResult}`).catch(e => null);
    const studentResponseData: StudentResponseData | null = getStudentInfo?.data ?? null;

    if(!studentResponseData){
        redLed.writeSync(0);
        setTimeout(() => {
            redLed.writeSync(1);
            yellowLed.writeSync(1);
        }, 3000);
        return;
    }

    try {
        const checkCurrentData = await prisma.student.findFirst({
            where: {
                student_id: scanResult
            }
        });

        if(!checkCurrentData){
            if(studentResponseData.status === "OK"){
                await prisma.student.create({
                    data: {
                        student_id: scanResult,
                        student_nickname: studentResponseData.data?.student_nickname,
                        student_firstname: studentResponseData.data?.student_firstname,
                        student_lastname: studentResponseData.data?.student_lastname
                    }
                });
                await sendLine(`นักเรียนหมายเลข : ${studentResponseData.data?.student_id} (${studentResponseData.data?.student_nickname} ${studentResponseData.data?.student_firstname} ${studentResponseData.data?.student_lastname}) ได้ขึ้นรถเเล้วครับ`);
                greenLed.writeSync(0);
                setTimeout(() => {
                    greenLed.writeSync(1);
                    yellowLed.writeSync(1);
                }, 3000);
            }
            else {
                console.log("- Student ID Not Found");
                redLed.writeSync(0);
                setTimeout(() => {
                    redLed.writeSync(1);
                    yellowLed.writeSync(1);
                }, 3000);
            }
            return;
        }
        else {
            // move data
            await prisma.history.create({
                data: {
                    student_id: checkCurrentData.student_id,
                    student_firstname: checkCurrentData.student_firstname,
                    student_lastname: checkCurrentData.student_lastname,
                    student_nickname: checkCurrentData.student_nickname,
                    geton_at: checkCurrentData.created_at,
                    getoff_at: String(new Date().toISOString())
                }
            });
            // remove data
            await prisma.student.deleteMany({
                where: {
                    student_id: checkCurrentData.student_id
                }
            });
            // Send Line
            await sendLine(`นักเรียนหมายเลข : ${studentResponseData.data?.student_id} (${studentResponseData.data?.student_nickname} ${studentResponseData.data?.student_firstname} ${studentResponseData.data?.student_lastname}) ได้ลงรถเเล้วครับ`);

            greenLed.writeSync(0);
            setTimeout(() => {
                greenLed.writeSync(1);
                yellowLed.writeSync(1);
            }, 3000);

            
            if(studentSignedOut === false){
                console.log("- Timer Started");
                startTimer();
                studentSignedOut = true;
            }
            return;
        }
    }
    catch(e){
        redLed.writeSync(0);
        setTimeout(() =>{
            redLed.writeSync(1);
            yellowLed.writeSync(1);
        }, 3000);
        return;
    }
}