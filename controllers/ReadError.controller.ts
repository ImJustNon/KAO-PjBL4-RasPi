import { redLed } from "../index";

export function ReadError(err: Error): void {
    console.error('Error: ', err.message);
    redLed.writeSync(0);
    setTimeout(() => {
        redLed.writeSync(1);
    }, 3000);
    return;
}