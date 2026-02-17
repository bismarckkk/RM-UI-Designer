import GeneratorHelper from "../generator/generatorHelper";
import type { GeneratorData } from "../generator/generatorHelper";
import { clearToSerialMsg } from "../generator/toSerialMsg";
import { message } from "../app";

type SerialPortLike = {
    open: (options: {
        baudRate: number;
        dataBits: number;
        stopBits: number;
        flowControl: string;
        parity: string;
    }) => Promise<void>;
    close: () => Promise<void>;
    writable: WritableStream<Uint8Array>;
};

type SerialNavigator = Navigator & {
    serial?: {
        requestPort: () => Promise<SerialPortLike>;
    };
};

type SerialWritePayload = {
    data: unknown;
    selected: string;
};

function isGeneratorData(value: unknown): value is GeneratorData {
    return !!value && typeof value === 'object';
}

class Serial {
    options = {
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        flowControl: 'none',
        parity: 'none'
    }
    writer: WritableStreamDefaultWriter<Uint8Array> | null = null
    private port: SerialPortLike | null = null

    async connect() {
        const serialNavigator = navigator as SerialNavigator;
        if (!serialNavigator.serial) {
            message.error('Web Serial API not supported.');
            return;
        }

        this.port = await serialNavigator.serial.requestPort();
        await this.port.open(this.options);

        this.writer = this.port.writable.getWriter();
    }

    async stop() {
        if (!this.writer || !this.port) {
            return;
        }
        await this.writer.releaseLock();
        this.writer = null
        await this.port.close();
        this.port = null
    }

    async write(data: SerialWritePayload) {
        if (!this.writer) {
            message.error('Serial port is not open.');
            return;
        }
        if (!isGeneratorData(data.data)) {
            message.error('Invalid UI data for serial output.');
            return;
        }
        const writer = this.writer;
        let timeout = 0;
        setTimeout(() => {
            void writer.write(clearToSerialMsg());
        }, timeout);
        timeout += 50
        const generatorHelper = new GeneratorHelper(data.data, false);
        const msgss = generatorHelper.toSerialMsg();
        const msgs = msgss[data.selected] ?? []
        for (const msg of msgs) {
            setTimeout(() => {
                void writer.write(msg);
            }, timeout);
            timeout += 50
        }
    }
}

export default Serial;
