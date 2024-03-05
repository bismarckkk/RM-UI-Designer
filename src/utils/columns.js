import Color from "../components/render/color";

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
    decimalPlaces: {
        title: 'Decimal Places',
        key: 'decimalPlaces',
        dataIndex: 'decimalPlaces',
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
            rules: [{max: 30}]
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
    backgroundImage: {
        title: 'Background Image',
        key: 'backgroundImage',
        dataIndex: 'backgroundImage',
        valueType: 'switch'
    }
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
