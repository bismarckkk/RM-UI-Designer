interface MessageType {
    level: string;
    message: string;
    time: Date
}

class Logger {
    private messages: MessageType[] = [];
    public enabled: boolean = false;

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

    get() {
        return this.messages;
    }
}

const logger = new Logger();

export default logger;
