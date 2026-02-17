import SerialTransformer from './serialTransformer';
import { getEvent } from './msgView';
import logger from "./logger";
import { message } from "../app";
import { rid } from "../app";
import type { msg as SerialMsg } from "./msgView";

type SerialPortLike = {
    open: (options: {
        baudRate: number;
        dataBits: number;
        stopBits: number;
        flowControl: string;
        parity: string;
    }) => Promise<void>;
    close: () => Promise<void>;
    readable: ReadableStream<Uint8Array>;
    writable: WritableStream<Uint8Array>;
};

type SerialNavigator = Navigator & {
    serial?: {
        requestPort: () => Promise<SerialPortLike>;
    };
};

class Serial {
    options = {
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        flowControl: 'none',
        parity: 'none'
    }

    private onEvent: (event: SerialMsg) => string[] | void
    private onError: (error: unknown) => void
    private reader: ReadableStreamDefaultReader<Uint8Array> | null
    private transformer: TransformStream<Uint8Array, Uint8Array>
    private port: SerialPortLike | null
    private readableStreamClosed: Promise<void> | null

    constructor(onEvent: (event: SerialMsg) => string[] | void, onError: (error: unknown) => void) {
        this.onEvent = onEvent;
        this.onError = onError;
        this.reader = null;
        this.transformer = new TransformStream(new SerialTransformer());
        this.port = null;
        this.readableStreamClosed = null;
    }

    async connect() {
        const serialNavigator = navigator as SerialNavigator;
        if (!serialNavigator.serial) {
            message.error('Web Serial API not supported.');
            return;
        }

        this.port = await serialNavigator.serial.requestPort();
        await this.port.open(this.options);

        this.readableStreamClosed = this.port.readable.pipeTo(this.transformer.writable);
        this.reader = this.transformer.readable.getReader();

        logger.enabled = true;
        logger.clear()

        this.readLoop()
    }

    async stop() {
        if (!this.port || !this.reader || !this.readableStreamClosed) {
            return;
        }

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
        this.port = null;
        this.readableStreamClosed = null;
        logger.enabled = false;
    }

    async readLoop() {
        try {
            if (!this.reader) {
                return;
            }
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
                const errs = this?.onEvent(event);
                if (errs) {
                    for (const err of errs) {
                        if (err[0] === 'W') {
                            logger.warn(err.slice(3));
                        } else if (err[0] === 'E') {
                            logger.error(err.slice(3));
                        }
                    }
                }
            }
        } catch (error) {
            try {
                await this.stop()
            } catch (_) { }
            this.reader = null;
            this.transformer = new TransformStream(new SerialTransformer());
            this.port = null;
            this.readableStreamClosed = null;
            logger.enabled = false;
            logger.clear()
            this.onError(error);
        }
    }

    getLog() {
        return logger.get()
    }

    getHistory() {
        return logger.getHistory()
    }
}

export default Serial;
