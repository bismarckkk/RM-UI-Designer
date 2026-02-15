import GeneratorHelper from "../generator/generatorHelper";
import { clearToSerialMsg } from "../generator/toSerialMsg";
import { message } from "../app";

class Serial {
    options = {
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        flowControl: 'none',
        parity: 'none'
    }
    writer = null

    async connect() {
        if (!('serial' in navigator)) {
            message.error('Web Serial API not supported.');
            return;
        }

        this.port = await navigator.serial.requestPort();
        await this.port.open(this.options);

        this.writer = this.port.writable.getWriter();
    }

    async stop() {
        await this.writer.releaseLock();
        this.writer = null
        await this.port.close();
    }

    async write(data) {
        if (!this.writer) {
            message.error('Serial port is not open.');
            return;
        }
        let timeout = 0;
        setTimeout(() => {
            this.writer.write(clearToSerialMsg());
        }, timeout);
        timeout += 50
        const generatorHelper = new GeneratorHelper(data.data);
        const msgss = generatorHelper.toSerialMsg();
        const msgs = msgss[data.selected]
        for (let msg of msgs) {
            setTimeout(() => {
                this.writer.write(msg);
            }, timeout);
            timeout += 50
        }
    }
}

export default Serial;
