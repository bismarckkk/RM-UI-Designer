import { ui_c_split, ui_c_string_split, ui_h_split } from "./template";
import { splitToSerialMsg } from "./toSerialMsg";

class GroupSplit {
    constructor(frame_name, frame_id, group_name, group_id, split_id, start_id, objs) {
        this.frame_name = frame_name
        this.frame_id = frame_id
        this.group_name = group_name
        this.group_id = group_id
        this.split_id = split_id
        this.start_id = start_id
        this.objs = objs

        if (objs[0].type === "UiText") {
            this.toSplitC = () => ui_c_string_split(
                this.frame_name, this.frame_id, this.group_name, this.group_id,
                this.split_id, this.start_id, this.objs
            )
        } else {
            let frame_obj_num = 7
            if (objs.length === 1) {
                frame_obj_num = 1
            } else if (objs.length <= 2) {
                frame_obj_num = 2
            } else if (objs.length <= 5) {
                frame_obj_num = 5
            }
            this.toSplitC = () => ui_c_split(
                this.frame_name, this.frame_id, this.group_name, this.group_id,
                this.split_id, this.start_id, this.objs, frame_obj_num
            )
        }

        this.toSplitH = () => ui_h_split(this.frame_name, this.group_name, this.split_id, this.objs)
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

    check() {
        if (this.objs.length !== 1 && this.objs.length !== 2 && this.objs.length !== 5 && this.objs.length !== 7) {
            return [{
                level: 'warning',
                info: `Length of Frame "${this.frame_name}" Group "${this.group_name}" Split "${this.split_id}" is not 1 or 2 or 5 or 7.`
            }]
        } else {
            return []
        }
    }
}

export default GroupSplit
