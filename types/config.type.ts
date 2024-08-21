
export type Gpio = {
    redLedPin: number;
    yellowLedPin: number;
    greenLedPin: number;
    buzzerPin: number;
    alertLedPin: number;
}
export type Config = {
    port: string;
    baudRate: number;
    gpio: Gpio;
    lineToken: string;
    apiPort: number;
    timer: number;
}