import { Rect } from "@/utils/controllers/rect";
import { Line } from "@/utils/controllers/line";
import { Round } from "@/utils/controllers/round";
import { Ellipse } from "@/utils/controllers/ellipse";
import { Arc } from "@/utils/controllers/arc";
import { Text } from "@/utils/controllers/text";
import { Number } from "@/utils/controllers/number";
import { Float } from "@/utils/controllers/float";

import { message } from "@/utils/app";

const Controller = {
    Rect,
    Line,
    Round,
    Ellipse,
    Arc,
    Text,
    Number,
    Float,
}


export function createUiElement(options) {
    let obj = {
        id: options.id,
        name: options.name,
        layer: options.layer,
        groupName: options.group,
        ratio: options.ratio,
        team: options.team
    }
    const type = options.type.slice(2)
    return new Controller[type](obj)
}

export function getMenuProps() {
    let info = []
    for (let key of Object.keys(Controller)) {
        info.push({key: `Insert-${key}`, label: key})
    }
    return info
}
