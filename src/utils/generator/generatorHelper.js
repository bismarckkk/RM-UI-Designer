import { ui_h, getUiBase } from "./template";
import Frame from "./frame";

class GeneratorHelper {
    constructor(data) {
        this.frames = []
        if (Object.keys(data).length === 1) {
            this.frames.push(new Frame('g', 0, data[Object.keys(data)[0]]))
        } else {
            for (let frame_name in data) {
                this.frames.push(new Frame(frame_name, this.frames.length, data[frame_name]))
            }
        }
    }

    gen() {
        let code = {ui: {h: this.toUiH()}}
        for (let frame of this.frames) {
            for (let group of frame.groups) {
                for (let split of group.splits) {
                    code[`ui_${frame.name}_${group.group_name}_${split.split_id}`] = {
                        c: split.toSplitC(),
                        h: split.toSplitH()
                    }
                }
            }
        }
        return code
    }

    getUiBase() {
        return getUiBase();
    }

    toUiH() {
        return ui_h(this.frames)
    }

    check() {
        let res = []
        for (let frame of this.frames) {
            res = res.concat(frame.check())
        }
        return res
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
