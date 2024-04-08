import { dialog, fs } from '@tauri-apps/api';
import { isTauri } from "@/utils/utils";

interface IFileHandle {
    getFile(): Promise<File>;
    createWritable(): Promise<IWritableStream>;
}

interface IWritableStream {
    write(content: string): Promise<void>;
    close(): Promise<void>;
}

export class FileHandler {
    private readonly getContentFunc: () => string;
    private fileHandle: IFileHandle | string | null;
    private timerId: NodeJS.Timeout | null;
    private updateTimerId: NodeJS.Timeout | null;

    constructor(getContentFunc: () => string) {
        this.getContentFunc = getContentFunc;
        this.fileHandle = null;
        this.timerId = null;
        this.updateTimerId = null;
    }

    async open(): Promise<boolean> {
        this.fileHandle = null
        try {
            if (isTauri()) {
                const path = await dialog.open({
                    multiple: false,
                    directory: false,
                    filters: [{ name: 'rmui file', extensions: ['json', 'rmui'] }]
                });
                if (path !== null && path.length > 0 && typeof path === 'string') {
                    this.fileHandle = path.replace(/\\/g, '/');
                }
            } else {
                [this.fileHandle] = await window.showOpenFilePicker({
                    types: [
                        {
                            description: "rmui file",
                            accept: {
                                "application/json": [".json", ".rmui"],
                            },
                        },
                    ]
                });
            }
            this.enableAutoSave()
        } catch (_) {

        }
        return this.fileHandle !== null
    }

    async create(): Promise<boolean> {
        this.fileHandle = null
        try {
            if (isTauri()) {
                const path = await dialog.save({
                    filters: [{name: 'rmui file', extensions: ['rmui']}]
                });
                if (path !== null) {
                    this.fileHandle = path.replace(/\\/g, '/');
                }
            } else {
                this.fileHandle = await window.showSaveFilePicker({
                    types: [
                        {
                            description: "rmui file",
                            accept: {
                                "application/json": [".rmui"],
                            },
                        },
                    ]
                });
            }
            await this.write(JSON.stringify({version: 2, data: {default: {}}, selected: 'default'}))
            this.enableAutoSave()
        } catch (_) {

        }
        return this.fileHandle !== null
    }

    enableAutoSave() {
        this.timerId = setInterval(async () => {
            const content = this.getContentFunc();
            await this.write(content);
        }, 60000);
    }

    async disableAutoSave(): Promise<void> {
        await this.save()
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        if (this.updateTimerId) {
            clearTimeout(this.updateTimerId);
            this.updateTimerId = null;
        }
    }

    update() {
        if (this.timerId !== null) {
            if (this.updateTimerId !== null) {
                clearTimeout(this.updateTimerId);
                this.updateTimerId = null;
            }
            this.updateTimerId = setTimeout(async () => {
                const content = this.getContentFunc();
                await this.write(content);
            }, 2000)
        }
    }

    async save() {
        const content = this.getContentFunc();
        await this.write(content);
    }

    async write(content: string): Promise<void> {
        if (!this.fileHandle) {
            throw new Error('File is not open');
        }
        if (typeof this.fileHandle === 'string') {
            await fs.writeTextFile(this.fileHandle, content);
        } else {
            const writable = await this.fileHandle.createWritable();
            await writable.write(content);
            await writable.close();
        }
    }

    async read(): Promise<File> {
        if (!this.fileHandle) {
            throw new Error('File is not open');
        }
        if (typeof this.fileHandle === 'string') {
            const content = await fs.readTextFile(this.fileHandle);
            const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
            return new File([blob], this.fileHandle);
        } else {
            return await this.fileHandle.getFile();
        }
    }
}

export function isAvailable() {
    return ('showOpenFilePicker' in window) || isTauri();
}
