import GroupSplit from "./groupSplit";

class Group {
    constructor(frame_name, group_name, _objs) {
        this.frame_name = frame_name
        this.group_name = group_name
        this.splits = []

        for (let obj of _objs) {
            if (obj.type === "UiText") {
                this.splits.push(new GroupSplit(
                    this.frame_name, this.splits.length, [obj]
                ))
            }
        }

        const objs = _objs.filter(obj => obj.type !== "UiText");
        const splitNum = Math.ceil(objs.length / 7);
        for (let i = 0; i < splitNum; i++) {
            this.splits.push(new GroupSplit(
                this.frame_name, this.splits.length, objs.slice(i * 7, (i + 1) * 7)
            ))
        }
    }

    toSerialMsg() {
        let res = []
        for (let split of this.splits) {
            res.push(split.toSerialMsg())
        }
        return res
    }
}

export default Group
