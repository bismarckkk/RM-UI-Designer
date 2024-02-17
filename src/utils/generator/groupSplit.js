import { ui_c_split, ui_c_string_split, ui_h_split } from "./template";

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

    check() {
        return []
    }
}

export default GroupSplit
