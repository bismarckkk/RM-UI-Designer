import SerialTransformer from './serialTransformer';
import { getEvent } from './msgView';
import { message } from "../app";

class Serial {
    constructor(onEvent) {
        this.onEvent = onEvent;
        this.reader = null;
        this.transformer = new TransformStream(new SerialTransformer());
    }

    async connect() {
        if (!('serial' in navigator)) {
            message.error('Web Serial API not supported.');
            return;
        }

        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });

        await port.readable.pipeThrough(this.transformer);

        this.readLoop();
    }

    async readLoop() {
        this.reader = this.transformer.readable.getReader();
        while (true) {
            const { value, done } = await this.reader.read();
            if (done) {
                this.reader.releaseLock();
                break;
            }

            const event = getEvent(value);
            this?.onEvent(event);
        }
    }
}

export default Serial;
