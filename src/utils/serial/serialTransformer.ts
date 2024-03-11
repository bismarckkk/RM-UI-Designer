import { calc_crc8, calc_crc16 } from './crc';

const possibleLength = [
    8, 21, 36, 81, 111, 51
]

class SerialTransformer {
    private buffer: Uint8Array;

    constructor() {
        this.buffer = new Uint8Array(0);
    }

    transform(chunk: Uint8Array, controller: TransformStreamDefaultController<Uint8Array>){
        this.buffer = Uint8Array.from([...this.buffer, ...chunk]);

        while (this.buffer.length > 7) {
            if (this.buffer[0] !== 0xA5) {
                this.buffer = this.buffer.subarray(1);
                continue;
            }

            if (this.buffer.length < 7) break;

            const length = this.buffer[1] | (this.buffer[2] << 8);
            const seq = this.buffer[3];
            const crc8 = this.buffer[4];
            const cmd_id = this.buffer[5] | (this.buffer[6] << 8);

            const header = this.buffer.subarray(0, 4);

            if (calc_crc8(header) !== crc8) {
                this.buffer = this.buffer.subarray(1);
                continue;
            }

            if (cmd_id !== 0x0301) {
                this.buffer = this.buffer.subarray(1);
                continue;
            }
            if (!(possibleLength.includes(length))) {
                this.buffer = this.buffer.subarray(1);
                continue;
            }

            if (this.buffer.length < 6 + length + 2) break;

            const data = this.buffer.subarray(7, 7 + length);
            const crc16 = this.buffer[7 + length] | (this.buffer[8 + length] << 8);

            if (calc_crc16(this.buffer.subarray(0, 7 + length)) !== crc16) {

                this.buffer = this.buffer.subarray(1);
                continue;
            }

            controller.enqueue(data);
            this.buffer = this.buffer.subarray(7 + length + 2);
        }
    }
}

export default SerialTransformer;
