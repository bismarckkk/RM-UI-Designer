import { ui_frame_h, ui_frame_c } from "./template";

class Frame {
    constructor(name, id, objs) {
        this.name = name
        this.id = id
        this.errors = []
        this.objs = []
        this.textObjs = []

        if (!/^[a-zA-Z_]+\w*$/.test(this.name)) {
            this.errors.push({
                level: 'error',
                info: `Name of Frame "${this.name}" does not compliant.`
            })
        }

        let groupNameSet = {}
        let groups = {}

        for (let obj_name in objs) {
            const obj = objs[obj_name]
            if (obj.group in groups) {
                groups[obj.group].push(obj)
                if (groupNameSet[obj.group].has(obj.name)) {
                    this.errors.push({
                        level: 'error',
                        info: `Name of Frame "${this.name}" Group "${obj.group}" Object "${obj.name}" is duplicate.`
                    })
                } else {
                    groupNameSet[obj.group].add(obj.name)
                }
            } else {
                groups[obj.group] = [obj]
                groupNameSet[obj.group] = new Set([obj.name])
            }
        }

        for (let objs in groups) {
            for (let obj of groups[objs]) {
                if (obj.type === "UiText") {
                    this.textObjs.push(obj)
                } else {
                    this.objs.push(obj)
                }
            }
        }
    }

    toC() {
        return ui_frame_c(this.name, this.objs, this.textObjs)
    }

    toH() {
        return ui_frame_h(this.name, this.objs, this.textObjs)
    }

    check() {
        return this.errors
    }
}

export default Frame
