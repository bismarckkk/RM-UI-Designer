import Group from "./group";

class Frame {
    constructor(name, id, objs) {
        this.name = name
        this.id = id
        this.groups = []

        let _groups = {}
        for (let obj of objs) {
            if (obj.group in _groups) {
                _groups[obj.group].push(obj)
            } else {
                _groups[obj.group] = [obj]
            }
        }

        for (let group_name in _groups) {
            this.groups.push(new Group(this.name, this.id, group_name, this.groups.length, _groups[group_name]))
        }
    }

    check() {
        let res = []
        for (let group of this.groups) {
            res = res.concat(group.check())
        }
        return res
    }
}

export default Frame
