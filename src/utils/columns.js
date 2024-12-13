import Color from "../components/render/color";

const renderRobotId = (idx) => {
    const rawIdx = idx
    let type = "Robot";
    if (idx > 0x100) {
        type = "Client"
        idx -= 0x100
    }
    let color;
    if (idx > 100) {
        color = "Blue"
    } else {
        color = "Red"
    }
    idx %= 100
    const map = {
        1: "Hero",
        2: "Engineer",
        3: "No3. Infantry",
        4: "No4. Infantry",
        5: "No5. Infantry",
        6: "Drone",
    }
    return `${color} ${map[idx]} ${type} (${rawIdx})`
}

export const columns = {
    id: {
        title: 'Id',
        key: 'id',
        dataIndex: 'id',
        valueType: 'digit',
        editable: false
    },
    name: {
        title: 'Name',
        key: 'name',
        dataIndex: 'name'
    },
    group: {
        title: 'Group',
        key: 'group',
        dataIndex: 'group'
    },
    kind: {
        title: 'Kind',
        key: 'kind',
        dataIndex: 'kind',
        editable: false
    },
    lineWidth: {
        title: 'Line Width',
        key: 'lineWidth',
        dataIndex: 'lineWidth',
        valueType: 'digit',
    },
    layer: {
        title: 'Layer',
        key: 'layer',
        dataIndex: 'layer',
        valueType: 'digit',
    },
    x: {
        title: 'X',
        key: 'x',
        dataIndex: 'x',
        valueType: 'digit',
    },
    y: {
        title: 'Y',
        key: 'y',
        dataIndex: 'y',
        valueType: 'digit',
    },
    x2: {
        title: 'X2',
        key: 'x2',
        dataIndex: 'x2',
        valueType: 'digit',
    },
    y2: {
        title: 'Y2',
        key: 'y2',
        dataIndex: 'y2',
        valueType: 'digit',
    },
    width: {
        title: 'Width',
        key: 'width',
        dataIndex: 'width',
        valueType: 'digit',
    },
    height: {
        title: 'Height',
        key: 'height',
        dataIndex: 'height',
        valueType: 'digit',
    },
    rx: {
        title: 'Rx',
        key: 'rx',
        dataIndex: 'rx',
        valueType: 'digit',
    },
    ry: {
        title: 'Ry',
        key: 'ry',
        dataIndex: 'ry',
        valueType: 'digit',
    },
    r: {
        title: 'R',
        key: 'r',
        dataIndex: 'r',
        valueType: 'digit',
    },
    startAngle: {
        title: 'Start Angle',
        key: 'startAngle',
        dataIndex: 'startAngle',
        valueType: 'digit',
    },
    endAngle: {
        title: 'End Angle',
        key: 'endAngle',
        dataIndex: 'endAngle',
        valueType: 'digit',
    },
    fontSize: {
        title: 'Font Size',
        key: 'fontSize',
        dataIndex: 'fontSize',
        valueType: 'digit',
    },
    float: {
        title: 'Number',
        key: 'float',
        dataIndex: 'float',
        valueType: 'digit',
    },
    number: {
        title: 'Number',
        key: 'number',
        dataIndex: 'number',
        valueType: 'digit',
    },
    text: {
        title: 'Text',
        key: 'text',
        dataIndex: 'text',
        formItemProps: {
            rules: [{max: 30}, {type: 'string'}]
        }
    },
    color: {
        title: 'Color',
        key: 'color',
        dataIndex: 'color',
        valueType: 'select',
        valueEnum: {
            main: <Color color="Main" />,
            yellow: <Color color="Yellow" />,
            green: <Color color="Green" />,
            orange: <Color color="Orange" />,
            purple: <Color color="Purple" />,
            pink: <Color color="Pink" />,
            cyan: <Color color="Cyan" />,
            black: <Color color="Black" />,
            white: <Color color="White" />,
        },
    },
    team: {
        title: 'Team',
        key: 'team',
        dataIndex: 'team',
        valueType: 'select',
        valueEnum: {
            red: <Color color="Red" />,
            blue: <Color color="Blue" />,
        },
    },
    role: {
        title: 'Role',
        key: 'role',
        dataIndex: 'role',
        valueType: 'select',
        valueEnum: {
            1: "Hero",
            2: "Engineer",
            3: "No3. Infantry",
            4: "No4. Infantry",
            5: "No5. Infantry",
            6: "Drone",
        },
    },
    backgroundImage: {
        title: 'Background Image',
        key: 'backgroundImage',
        dataIndex: 'backgroundImage',
        valueType: 'switch'
    },
    length: {
        title: 'DataLength',
        key: 'length',
        dataIndex: 'length',
        valueType: 'digit',
    },
    seq: {
        title: 'Seq',
        key: 'seq',
        dataIndex: 'seq',
        valueType: 'digit',
    },
    cmd_id: {
        title: 'Cmd Id',
        key: 'cmd_id',
        dataIndex: 'cmd_id',
        valueType: 'text',
        renderText: (idx) => `0x${idx.toString(16).padStart(4, '0')}`
    },
    sub_id: {
        title: 'Sub Id',
        key: 'sub_id',
        dataIndex: 'sub_id',
        valueType: 'text',
        renderText: (idx) => `0x${idx.toString(16).padStart(4, '0')}`
    },
    sender: {
        title: 'Sender',
        key: 'sender',
        dataIndex: 'sender',
        valueType: 'select',
        renderText: renderRobotId
    },
    receiver: {
        title: 'Receiver',
        key: 'receiver',
        dataIndex: 'receiver',
        valueType: 'select',
        renderText: renderRobotId
    },
    error: {
        title: 'Error',
        key: 'error',
        dataIndex: 'error',
        valueType: 'text',
    },
}

export function getColumnsFromData(data) {
    const keys = Object.keys(data)
    let _columns = []
    for(let i = 0; i < keys.length; i++) {
        if (columns[keys[i]]) {
            _columns.push(columns[keys[i]])
        }
    }
    return _columns
}
