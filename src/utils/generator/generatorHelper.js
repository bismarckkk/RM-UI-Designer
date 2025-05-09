import Frame from "./frame";

const interfaceHUrlS = require('@/assets/code_template/static/ui_interface.h')
const interfaceCUrlS = require('@/assets/code_template/static/ui_interface.c')
const typesHUrlS = require('@/assets/code_template/static/ui_types.h')

const interfaceHUrlD = require('@/assets/code_template/dynamic/ui_interface.h')
const interfaceCUrlD = require('@/assets/code_template/dynamic/ui_interface.c')
const typesHUrlD = require('@/assets/code_template/dynamic/ui_types.h')

async function getUiBase(static_mode) {
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
    constructor(data, static_mode) {
        this.res = JSON.parse(window.Module.generate(JSON.stringify(data), static_mode))
        this.frames = []
        if (Object.keys(data).length === 1) {
            this.frames.push(new Frame('g', data[Object.keys(data)[0]]))
        } else {
            for (let frame_name in data) {
                this.frames.push(new Frame(frame_name, data[frame_name]))
            }
        }
    }

    gen() {
        return this.res.code
    }

    getUiBase(static_mode) {
        return () => getUiBase(static_mode);
    }

    check() {
        return this.res.info
    }

    toSerialMsg() {
        let res = {}
        for (let frame of this.frames) {
            res[frame.name] = frame.toSerialMsg()
        }
        return res
    }
}

export default GeneratorHelper
