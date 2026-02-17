import {calc_crc16, calc_crc8} from "@/utils/serial/crc";
import logger from "@/utils/serial/logger";

export const objectTypeMap = [
    'UiLine',
    'UiRect',
    'UiRound',
    'UiEllipse',
    'UiArc',
    'UiFloat',
    'UiNumber',
    'UiText'
]

export const colorType = [
    'main',
    'yellow',
    'green',
    'orange',
    'purple',
    'pink',
    'cyan',
    'black',
    'white',
]

export const objectEventType = [
    'null',
    'add',
    'update',
    'remove'
]

const cmdId2len: {[propName: number]: number} = {
    0x0101: 1,
    0x0102: 2,
    0x0103: 5,
    0x0104: 7,
}

const layerType = [
    'null',
    'removeLayer',
    'removeAll',
]

export interface objectType {
    layer: number,
    group: string,
    type: string,
    id: number,
    name: string,
    color: string,
    lineWidth: number,
    x: number,
    y: number,
    x2?:number,
    y2?:number,
    width?:number,
    height?:number,
    rx?:number,
    ry?:number,
    r?:number,
    startAngle?:number,
    endAngle?:number,
    fontSize?:number,
    float?:number,
    number?:number,
    text?:string,
    _start: number,
    _end: number,
}

export interface layerType {
    layer: number,
}

export interface event {
    type: string,
    obj?: objectType | layerType
}

export interface msg {
    sender: number,
    receiver: number,
    sub_id: number,
    events: event[]
}

export interface msgObj {
    group: string,
    id: number,
    operate_tpyel: number,
    figure_tpye: number,
    layer: number,
    color: number,
    _a: number,
    _b: number,
    width: number,
    start_x: number,
    start_y: number,
    _c: number,
    _d: number,
    _e: number,
    number?: number
}

function getUint16(msg: Uint8Array, index: number) {
    return msg[index] | (msg[index + 1] << 8)
}

function getUint32(msg: Uint8Array, index: number) {
    return msg[index] | (msg[index + 1] << 8) | (msg[index + 2] << 16) | (msg[index + 3] << 24);
}

function unpackObject(data: Uint8Array) : msgObj {
    let offset = 0;

    // figure_name is 3 bytes
    const frame = data[offset++]
    const _group = data[offset++]
    const group = `${frame}-${_group}`
    const id = data[offset++] | _group << 8 | frame << 16;

    // Next is a 32-bit integer with several bitfields
    const bitfield1 = getUint32(data, offset);
    offset += 4;
    const operate_tpyel = bitfield1 & 0x7; // first 3 bits
    const figure_tpye = (bitfield1 >> 3) & 0x7; // next 3 bits
    const layer = (bitfield1 >> 6) & 0xf; // next 4 bits
    const color = (bitfield1 >> 10) & 0xf; // next 4 bits
    const _a = (bitfield1 >> 14) & 0x1ff; // next 9 bits
    const _b = (bitfield1 >> 23) & 0x1ff; // next 9 bits

    // Next is a 32-bit integer with two bitfields
    const bitfield2 = getUint32(data, offset);
    offset += 4;
    const width = bitfield2 & 0x3ff; // first 10 bits
    const start_x = (bitfield2 >> 10) & 0x7ff; // next 11 bits
    const start_y = (bitfield2 >> 21) & 0x7ff; // next 11 bits

    // Next is a 32-bit integer with three bitfields
    const bitfield3 = getUint32(data, offset);
    const _c = bitfield3 & 0x3ff; // first 10 bits
    const _d = (bitfield3 >> 10) & 0x7ff; // next 11 bits
    const _e = (bitfield3 >> 21) & 0x7ff; // next 11 bits

    return {
        group,
        id,
        operate_tpyel,
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
        number: bitfield3
    };
}

export function getEvent(msg: Uint8Array) {
    const cmd_id = getUint16(msg, 0)
    const sender = getUint16(msg, 2)
    const receiver = getUint16(msg, 4)

    let events: event[] = []
    if (cmd_id === 0x0100) {
        events.push(<event>{
            type: layerType[msg[6]],
            obj: <layerType>{
                layer: msg[7]
            }
        })
    } else if (cmd_id === 0x0110) {
        const prop = unpackObject(msg.subarray(6, 21))
        const text = String.fromCharCode(...msg.subarray(21, 21 + prop._b))
        events.push(<event>{
            type: objectEventType[prop.operate_tpyel],
            obj: <objectType>{
                layer: prop.layer,
                group: prop.group,
                type: objectTypeMap[prop.figure_tpye],
                id: prop.id,
                name: `${objectTypeMap[prop.figure_tpye]}_${prop.id & 0xFF}`,
                color: colorType[prop.color],
                lineWidth: prop.width,
                x: prop.start_x,
                y: prop.start_y,
                fontSize: prop._a,
                text,
                _start: 6,
                _end: msg.length
            }
        })
    } else if (cmd_id in cmdId2len) {
        const len = cmdId2len[cmd_id]
        for (let i = 0; i < len; i++) {
            const obj = unpackObject(msg.subarray(6 + i * 15, 6 + (i + 1) * 15))
            let _obj: objectType = {
                layer: obj.layer,
                group: obj.group,
                type: objectTypeMap[obj.figure_tpye],
                id: obj.id,
                name: `${objectTypeMap[obj.figure_tpye]}_${obj.id & 0xFF}`,
                color: colorType[obj.color],
                lineWidth: obj.width,
                x: obj.start_x,
                y: obj.start_y,
                _start: 6 + i * 15,
                _end: 6 + (i + 1) * 15
            }
            switch (objectTypeMap[obj.figure_tpye].slice(2)) {
                case 'Line':
                    _obj.x2 = obj._d
                    _obj.y2 = obj._e
                    break
                case 'Rect':
                    _obj.width = obj._d - obj.start_x
                    _obj.height = obj._e - obj.start_y
                    break
                case 'Round':
                    _obj.r = obj._c
                    break
                case 'Ellipse':
                    _obj.rx = obj._d
                    _obj.ry = obj._e
                    break
                case 'Arc':
                    _obj.startAngle = obj._a
                    _obj.endAngle = obj._b
                    _obj.rx = obj._d
                    _obj.ry = obj._e
                    break
                case 'Float':
                    _obj.fontSize = obj._a
                    // @ts-ignore
                    _obj.float = obj.number / 1000
                    break
                case 'Number':
                    _obj.fontSize = obj._a
                    _obj.number = obj.number
                    break
            }
            events.push(<event>{
                type: objectEventType[obj.operate_tpyel],
                obj: _obj
            })
        }
    } else {
        console.log('unknown sub_id', cmd_id)
    }
    return <msg>{
        sender,
        receiver,
        sub_id: cmd_id,
        events
    }
}

interface Header {
    length: number,
    seq: number,
    cmd_id: number
}

interface HeaderResult {
    code: number,
    msg?: Uint8Array,
    header?: Header,
    error?: string,
    loc?: number[]
}

export function getHeader(msg: Uint8Array) : HeaderResult {
    const possibleLength = [
        8, 21, 36, 81, 111, 51
    ]

    if (msg[0] !== 0xA5) {
        return {
            code: 1,
            error: 'Message must start with 0xA5',
            loc: [0]
        }
    }

    if (msg.length < 7) {
        return {
            code: 2,
            error: 'Message length must be at least 7 bytes',
            loc: [0]
        }
    }

    const length = msg[1] | (msg[2] << 8);
    const seq = msg[3];
    const crc8 = msg[4];
    const cmd_id = msg[5] | (msg[6] << 8);

    const header = msg.subarray(0, 4);

    if (calc_crc8(header) !== crc8) {
        return {
            code: 3,
            error: `crc8 error, calc: 0x${calc_crc8(header).toString(16)}, msg: 0x${crc8.toString(16)}`,
            loc: [4]
        }
    }

    if (cmd_id !== 0x0301) {
        return {
            code: 4,
            error: `cmd_id 0x${cmd_id.toString(16)} not match`,
            loc: [5, 6]
        }
    }
    if (!(possibleLength.includes(length))) {
        return {
            code: 5,
            error: `length error, length: ${length}`,
            loc: [1, 2]
        }
    }

    if (msg.length < 6 + length + 2) {
        return {
            code: 6,
            error: 'Message is not complete',
            loc: [msg.length - 1]
        }
    }

    const crc16 = msg[7 + length] | (msg[8 + length] << 8);

    if (calc_crc16(msg.subarray(0, 7 + length)) !== crc16) {
        return {
            code: 7,
            error: `crc16 error, calc: 0x${calc_crc16(msg.subarray(0, 7 + length)).toString(16)}, msg: 0x${crc16.toString(16)}`,
            loc: [7 + length, 8 + length],
            header: {
                length,
                    seq,
                    cmd_id
            }
        }
    }

    return {
        code: 0,
        msg: msg.subarray(7 + length + 2),
        header: {
            length,
            seq,
            cmd_id
        }
    }
}
