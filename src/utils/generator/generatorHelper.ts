import Frame from "./frame";
import interfaceHUrlS from '@/assets/code_template/static/ui_interface.h?url'
import interfaceCUrlS from '@/assets/code_template/static/ui_interface.c?url'
import typesHUrlS from '@/assets/code_template/static/ui_types.h?url'
import interfaceHUrlD from '@/assets/code_template/dynamic/ui_interface.h?url'
import interfaceCUrlD from '@/assets/code_template/dynamic/ui_interface.c?url'
import typesHUrlD from '@/assets/code_template/dynamic/ui_types.h?url'
import type { objectType } from "@/utils/serial/msgView";

type GeneratorObj = objectType
export type GeneratorData = Record<string, Record<string, GeneratorObj>>
type GeneratorResult = { code: Record<string, { h?: string; c?: string }>; info: Array<{ level: string; message: string }> }

async function getUiBase(static_mode: boolean) {
    if (static_mode) {
        return {
            ui_interface: {
                h: await (await fetch(interfaceHUrlS)).text(),
                c: await (await fetch(interfaceCUrlS)).text()
            },
            ui_types: {
                h: await (await fetch(typesHUrlS)).text()
            }
        }
    } else {
        return {
            ui_interface: {
                h: await (await fetch(interfaceHUrlD)).text(),
                c: await (await fetch(interfaceCUrlD)).text()
            },
            ui_types: {
                h: await (await fetch(typesHUrlD)).text()
            }
        }
    }
}

class GeneratorHelper {
    res: GeneratorResult
    frames: Frame[]

    constructor(data: GeneratorData, static_mode: boolean) {
        const moduleApi = window.Module as { generate: (input: string, staticMode: boolean) => string }
        this.res = JSON.parse(moduleApi.generate(JSON.stringify(data), static_mode))
        this.frames = []
        if (Object.keys(data).length === 1) {
            this.frames.push(new Frame('g', data[Object.keys(data)[0]]))
        } else {
            for (const frame_name in data) {
                this.frames.push(new Frame(frame_name, data[frame_name]))
            }
        }
    }

    gen() {
        return this.res.code
    }

    getUiBase(static_mode: boolean) {
        return () => getUiBase(static_mode);
    }

    check() {
        return this.res.info
    }

    toSerialMsg() {
        const res: Record<string, Uint8Array[]> = {}
        for (const frame of this.frames) {
            res[frame.name] = frame.toSerialMsg()
        }
        return res
    }
}

export default GeneratorHelper
