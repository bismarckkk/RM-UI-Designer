import GroupSplit from "./groupSplit";
import type { objectType } from "@/utils/serial/msgView";

type GroupObj = objectType;

class Group {
    frame_name: string
    group_name: string
    splits: GroupSplit[]

    constructor(frame_name: string, group_name: string, _objs: GroupObj[]) {
        this.frame_name = frame_name
        this.group_name = group_name
        this.splits = []

        for (const obj of _objs) {
            if (obj.type === "UiText") {
                this.splits.push(new GroupSplit(
                    this.frame_name, this.splits.length, [obj]
                ))
            }
        }

        const objs = _objs.filter((obj) => obj.type !== "UiText");
        const splitNum = Math.ceil(objs.length / 7);
        for (let i = 0; i < splitNum; i++) {
            this.splits.push(new GroupSplit(
                this.frame_name, this.splits.length, objs.slice(i * 7, (i + 1) * 7)
            ))
        }
    }

    toSerialMsg() {
        const res: Uint8Array[] = []
        for (const split of this.splits) {
            res.push(split.toSerialMsg())
        }
        return res
    }
}

export default Group
