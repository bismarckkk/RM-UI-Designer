interface MessageType {
    level: string;
    message: string;
    time: Date
}

class Logger {
    private messages: MessageType[] = [];
    public enabled: boolean = false;
    public log: Uint8Array[] = [];
    public rx: number = 0;

    warn(message: string) {
        if (this.enabled) {
            this.messages.push({level: 'warn', message, time: new Date()});
            console.warn(message);
        }
        if (this.messages.length > 100) {
            this.messages = this.messages.slice(-100);
        }
    }

    error(message: string) {
        if (this.enabled) {
            this.messages.push({level: 'error', message, time: new Date()});
            console.error(message);
        }
        if (this.messages.length > 100) {
            this.messages = this.messages.slice(-100);
        }
    }

    clear() {
        this.messages = [];
    }

    logHistory(chunk: Uint8Array) {
        this.log.push(Uint8Array.from([...chunk]));
        this.rx += chunk.length;
        if (this.log.length > 100) {
            this.log.shift();
        }
    }

    get() {
        return this.messages;
    }

    getHistory() {
        return {
            log: this.log,
            rx: this.rx
        }
    }
}

const logger = new Logger();

export default logger;
