import SerialTransformer from './serialTransformer';
import { getEvent } from './msgView';
import logger from "./logger";
import { message } from "../app";
import { rid } from "../app";

class Serial {
    options = {
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        flowControl: 'none',
        parity: 'none'
    }

    constructor(onEvent, onError) {
        this.onEvent = onEvent;
        this.onError = onError;
        this.reader = null;
        this.transformer = new TransformStream(new SerialTransformer());
    }

    async connect() {
        if (!('serial' in navigator)) {
            message.error('Web Serial API not supported.');
            return;
        }

        this.port = await navigator.serial.requestPort();
        await this.port.open(this.options);

        this.readableStreamClosed = this.port.readable.pipeTo(this.transformer.writable);
        this.reader = this.transformer.readable.getReader();

        logger.enabled = true;
        logger.clear()

        this.readLoop()
    }

    async stop() {
        const textEncoder = new TextEncoderStream();
        const writer = textEncoder.writable.getWriter();
        const writableStreamClosed = textEncoder.readable.pipeTo(this.port.writable);

        this.reader.cancel();
        await this.readableStreamClosed.catch(() => { /* Ignore the error */ });

        writer.close();
        await writableStreamClosed;

        await this.port.close();

        this.reader = null;
        this.transformer = new TransformStream(new SerialTransformer());
        logger.enabled = false;
    }

    async readLoop() {
        try {
            while (true) {
                const { value, done } = await this.reader.read();
                if (done) {
                    this.reader.releaseLock();
                    break;
                }

                const event = getEvent(value);
                if (event.sender !== rid) {
                    logger.error(`Sender ${event.sender} not match self ${rid}`);
                    continue
                }
                if (event.receiver !== rid + 256) {
                    logger.error(`Receiver ${event.receiver} not match self ${rid}`);
                    continue
                }
                this?.onEvent(event);
            }
        } catch (error) {
            try {
                await this.stop()
            } catch (_) { }
            this.reader = null;
            this.transformer = new TransformStream(new SerialTransformer());
            logger.enabled = false;
            logger.clear()
            this.onError(error);
        }
    }

    getLog() {
        return logger.get()
    }
}

export default Serial;
