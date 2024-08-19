import { PrismaClient } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { config } from "../config/config";
import { greenLed, redLed, yellowLed } from "../index";
import { StudentResponseData } from "../types/student.type";

const prisma: PrismaClient = new PrismaClient();


export async function DataRecieve(data: Buffer): Promise<void> {
    yellowLed.writeSync(0);
    
    // console.log('Barcode data:', data.toString());
    const scanResult: string = data.toString();
    console.log(`Recieve Data : ${scanResult}`);
    if(isNaN(parseInt(scanResult))){
        redLed.writeSync(0);
        setTimeout(() => {
            redLed.writeSync(1);
            yellowLed.writeSync(1);
        }, 3000);
        return;
    }

    const getStudentInfo: AxiosResponse<StudentResponseData, any> | null = await axios.get(`https://kao-pjbl4-backend.vercel.app/api/v1/student/${scanResult}`).catch(e => null);
    const studentResponseData: StudentResponseData = getStudentInfo?.data!;
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
            }
            else {
                await prisma.student.create({
                    data: {
                        student_id: scanResult,
                    }
                });
            }

            greenLed.writeSync(0);
            setTimeout(() =>{
                greenLed.writeSync(1);
                yellowLed.writeSync(1);
            }, 3000);
            return;
        }
        else {
            await axios.post("https://notify-api.line.me/api/notify", `message=เด็กเหี้ย : ${checkCurrentData.student_id} (${checkCurrentData.student_nickname} ${checkCurrentData.student_firstname} ${checkCurrentData.student_lastname}) ได้ลงรถเเล้วจ้าาาา`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${config.lineToken}`,
                },
            });
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

            greenLed.writeSync(0);
            setTimeout(() => {
                greenLed.writeSync(1);
                yellowLed.writeSync(1);
            }, 3000);
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