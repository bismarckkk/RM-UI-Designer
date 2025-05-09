import Group from "./group";

class Frame {
    constructor(name, objs) {
        this.name = name
        this.groups = []

        let _groups = {}
        for (let obj_name in objs) {
            const obj = objs[obj_name]
            if (obj.group in _groups) {
                _groups[obj.group].push(obj)
            } else {
                _groups[obj.group] = [obj]
            }
        }

        for (let group_name in _groups) {
            this.groups.push(new Group(this.name, group_name, _groups[group_name]))
        }
    }

    toSerialMsg() {
        let res = []
        for (let group of this.groups) {
            res = res.concat(group.toSerialMsg())
        }
        return res
    }
}

export default Frame
