import { dialog, fs } from '@tauri-apps/api';
import { message } from "@/utils/app";
import { isTauri } from "@/utils/utils";

interface IFileHandle {
    getFile(): Promise<File>;
    createWritable(): Promise<IWritableStream>;
}

interface IWritableStream {
    write(content: string): Promise<void>;
    close(): Promise<void>;
}

type FilePickerWindow = Window & {
    showOpenFilePicker?: (options: {
        types: Array<{
            description: string;
            accept: Record<string, string[]>;
        }>;
    }) => Promise<IFileHandle[]>;
    showSaveFilePicker?: (options: {
        types: Array<{
            description: string;
            accept: Record<string, string[]>;
        }>;
    }) => Promise<IFileHandle>;
};

export class FileHandler {
    private readonly getContentFunc: () => string;
    private fileHandle: IFileHandle | string | null;
    private timerId: ReturnType<typeof setInterval> | null;
    private updateTimerId: ReturnType<typeof setTimeout> | null;

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
                    const fileName = this.fileHandle.split('/').pop();
                    document.title = `${fileName} - RM UI Designer`;
                }
            } else {
                const picker = window as FilePickerWindow
                if (!picker.showOpenFilePicker) {
                    throw new Error('showOpenFilePicker is not available')
                }
                [this.fileHandle] = await picker.showOpenFilePicker({
                    types: [
                        {
                            description: "rmui file",
                            accept: {
                                "application/json": [".json", ".rmui"],
                            },
                        },
                    ]
                });
                if (this.fileHandle && typeof this.fileHandle !== 'string') {
                    const fileName = (await this.fileHandle.getFile()).name;
                    document.title = `${fileName} - RM UI Designer`;
                }
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
                    const fileName = this.fileHandle.split('/').pop();
                    document.title = `${fileName} - RM UI Designer`;
                }
            } else {
                const picker = window as FilePickerWindow
                if (!picker.showSaveFilePicker) {
                    throw new Error('showSaveFilePicker is not available')
                }
                this.fileHandle = await picker.showSaveFilePicker({
                    types: [
                        {
                            description: "rmui file",
                            accept: {
                                "application/json": [".rmui"],
                            },
                        },
                    ]
                });
                if (this.fileHandle && typeof this.fileHandle !== 'string') {
                    const fileName = (await this.fileHandle.getFile()).name;
                    document.title = `${fileName} - RM UI Designer`;
                }
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
        message.success('Auto save enabled')
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
        message.warning('Auto save disabled')
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
