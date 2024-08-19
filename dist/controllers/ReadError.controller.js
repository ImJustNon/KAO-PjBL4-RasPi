"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadError = ReadError;
const index_1 = require("../index");
function ReadError(err) {
    console.error('Error: ', err.message);
    index_1.redLed.writeSync(0);
    setTimeout(() => {
        index_1.redLed.writeSync(1);
    }, 3000);
    return;
}
//# sourceMappingURL=ReadError.controller.js.map