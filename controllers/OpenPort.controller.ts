import { config } from "../config/config";

export function openPort(): void{
    console.log(`> Serial Port ${config.port} Connected`);
}
