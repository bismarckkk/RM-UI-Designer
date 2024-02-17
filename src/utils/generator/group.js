import GroupSplit from "./groupSplit";

class Group {
    constructor(frame_name, frame_id, group_name, group_id, _objs) {
        this.frame_name = frame_name
        this.frame_id = frame_id
        this.group_name = group_name
        this.group_id = group_id
        this.splits = []

        let start_id = 0
        for (let obj of _objs) {
            if (obj.type === "UiText") {
                this.splits.push(new GroupSplit(
                    this.frame_name, this.frame_id, this.group_name, this.group_id,
                    this.splits.length, start_id, obj
                ))
                start_id += 1
            }
        }

        const objs = _objs.filter(obj => obj.type !== "UiText");
        const splitNum = Math.ceil(objs.length / 7);
        for (let i = 0; i < splitNum; i++) {
            this.splits.push(new GroupSplit(
                this.frame_name, this.frame_id, this.group_name, this.group_id,
                this.splits.length, start_id, objs.slice(i * 7, (i + 1) * 7)
            ))
            start_id += 7
        }
    }

    check() {
        let res = []
        for (let split of this.splits) {
            res = res.concat(split.check())
        }
        return res
    }
}

export default Group
