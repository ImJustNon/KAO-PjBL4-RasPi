import axios from "axios";
import { StudentInfoResponseData } from "../types/student.type";
import { config } from "../config/config";


export async function sendLine(msg: string): Promise<void> {
    try {
        await axios.post("https://notify-api.line.me/api/notify", `message=${msg}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${config.lineToken}`,
            },
        });
    }
    catch(e){
        console.log(e);
    }
}