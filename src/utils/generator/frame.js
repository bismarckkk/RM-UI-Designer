import Group from "./group";

class Frame {
    constructor(name, id, objs) {
        this.name = name
        this.id = id
        this.groups = []
        this.errors = []

        if (!/^[a-zA-Z_]+\w*$/.test(this.name)) {
            this.errors.push({
                level: 'error',
                info: `Name of Frame "${this.name}" does not compliant.`
            })
        }

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
            this.groups.push(new Group(this.name, this.id, group_name, this.groups.length, _groups[group_name]))
        }
    }

    toSerialMsg() {
        let res = []
        for (let group of this.groups) {
            res = res.concat(group.toSerialMsg())
        }
        console.log(res)
        return res
    }

    check() {
        let res = this.errors
        for (let group of this.groups) {
            res = res.concat(group.check())
        }
        return res
    }
}

export default Frame
