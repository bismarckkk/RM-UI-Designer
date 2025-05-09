import { splitToSerialMsg } from "./toSerialMsg";

class GroupSplit {
    constructor(frame_name, split_id, objs) {
        this.frame_name = frame_name
        this.split_id = split_id
        this.objs = objs
    }

    toSerialMsg() {
        let objs = []
        for (let obj of this.objs) {
            const _obj = {...obj}
            _obj.group = `${this.frame_name}-${this.split_id}`
            objs.push(_obj)
        }
        return splitToSerialMsg(objs)
    }
}

export default GroupSplit
