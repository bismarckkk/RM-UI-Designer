import Group from "./group";
import type { objectType } from "@/utils/serial/msgView";

class Frame {
    name: string
    groups: Group[]

    constructor(name: string, objs: Record<string, objectType>) {
        this.name = name
        this.groups = []

        const _groups: Record<string, objectType[]> = {}
        for (const obj_name in objs) {
            const obj = objs[obj_name]
            if (obj.group in _groups) {
                _groups[obj.group].push(obj)
            } else {
                _groups[obj.group] = [obj]
            }
        }

        for (const group_name in _groups) {
            this.groups.push(new Group(this.name, group_name, _groups[group_name]))
        }
    }

    toSerialMsg() {
        let res: Uint8Array[] = []
        for (const group of this.groups) {
            res = res.concat(group.toSerialMsg())
        }
        return res
    }
}

export default Frame
