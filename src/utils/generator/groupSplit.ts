import { splitToSerialMsg } from "./toSerialMsg";
import type { objectType } from "@/utils/serial/msgView";

type GroupObj = objectType;

class GroupSplit {
    frame_name: string
    split_id: number
    objs: GroupObj[]

    constructor(frame_name: string, split_id: number, objs: GroupObj[]) {
        this.frame_name = frame_name
        this.split_id = split_id
        this.objs = objs
    }

    toSerialMsg() {
        const objs: GroupObj[] = []
        for (const obj of this.objs) {
            const _obj = {...obj}
            _obj.group = `${this.frame_name}-${this.split_id}`
            objs.push(_obj)
        }
        return splitToSerialMsg(objs)
    }
}

export default GroupSplit
