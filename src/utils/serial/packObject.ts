import { msgObj, objectType, objectTypeMap, colorType, objectEventType } from './msgView';

function msgObjToArray(obj: msgObj): Uint8Array {
    const data = new Uint8Array(15);
    let offset = 0;

    const groupParts = obj.group.split('-');
    data[offset++] = Math.round(Number(groupParts[0]));
    data[offset++] = Math.round(Number(groupParts[1]));
    data[offset++] = Math.round(obj.id);

    const bitfield1 = Math.round(obj.operate_tpyel) | (Math.round(obj.figure_tpye) << 3) | (Math.round(obj.layer) << 6) | (Math.round(obj.color) << 10) | (Math.round(obj._a) << 14) | (Math.round(obj._b) << 23);
    data[offset++] = bitfield1 & 0xff;
    data[offset++] = (bitfield1 >> 8) & 0xff;
    data[offset++] = (bitfield1 >> 16) & 0xff;
    data[offset++] = (bitfield1 >> 24) & 0xff;

    const bitfield2 = Math.round(obj.width) | (Math.round(obj.start_x) << 10) | (Math.round(obj.start_y) << 21);
    data[offset++] = bitfield2 & 0xff;
    data[offset++] = (bitfield2 >> 8) & 0xff;
    data[offset++] = (bitfield2 >> 16) & 0xff;
    data[offset++] = (bitfield2 >> 24) & 0xff;

    const bitfield3 = Math.round(obj._c) | (Math.round(obj._d) << 10) | (Math.round(obj._e) << 21);
    data[offset++] = bitfield3 & 0xff;
    data[offset++] = (bitfield3 >> 8) & 0xff;
    data[offset++] = (bitfield3 >> 16) & 0xff;
    data[offset++] = (bitfield3 >> 24) & 0xff;

    return data;
}

function objectTypeToMsgObj(obj: objectType, type: string = 'add'): msgObj {
    const group = obj.group;
    const id = obj.id;
    const figure_tpye = objectTypeMap.indexOf(obj.type);
    const color = colorType.indexOf(obj.color);
    const layer = obj.layer;
    let width;
    if (obj.fontSize) {
        width = Math.round(obj.fontSize / 10)
    } else {
        width = obj.lineWidth;
    }
    const start_x = obj.x;
    const start_y = obj.y;

    let _a = 0, _b = 0, _c = 0, _d = 0, _e = 0;

    switch (obj.type.slice(2)) {
        case 'Line':
            _d = obj.x2 || 0;
            _e = obj.y2 || 0;
            break;
        case 'Rect':
            _d = (obj.width || 0) + start_x;
            _e = (obj.height || 0) + start_y;
            break;
        case 'Round':
            _c = obj.r || 0;
            break;
        case 'Ellipse':
            _d = obj.rx || 0;
            _e = obj.ry || 0;
            break;
        case 'Arc':
            _a = obj.startAngle || 0;
            _b = obj.endAngle || 0;
            _d = obj.rx || 0;
            _e = obj.ry || 0;
            break;
        case 'Float':
            _a = obj.fontSize || 0;
            const num = (obj.float || 0) * 1000;
            _c = num & 0x3ff;
            _d = (num >> 10) & 0x7ff;
            _e = (num >> 21) & 0x7ff;
            break;
        case 'Number':
            _a = obj.fontSize || 0;
            const num2 = obj.number || 0;
            _c = num2 & 0x3ff;
            _d = (num2 >> 10) & 0x7ff;
            _e = (num2 >> 21) & 0x7ff;
            break;
        case 'Text':
            _a = obj.fontSize || 0;
            _b = (obj.text || '').length;
            break;
    }

    return {
        group,
        id,
        operate_tpyel: objectEventType.indexOf(type),
        figure_tpye,
        layer,
        color,
        _a,
        _b,
        width,
        start_x,
        start_y,
        _c,
        _d,
        _e,
        number: _c
    };
}

export function packObject(obj: objectType): Uint8Array {
    return msgObjToArray(objectTypeToMsgObj(obj));
}
