import { packObject } from "../serial/packObject";
import { objectType } from "@/utils/serial/msgView";
import { calc_crc8, calc_crc16 } from "@/utils/serial/crc";
import { rid } from "../app";

function normalDataField(objs: objectType[]) : Uint8Array {
    let data = new Uint8Array(0);
    objs.forEach(obj => {
        data = new Uint8Array([...data, ...packObject(obj)]);
    });
    if (2 < objs.length && objs.length < 5) {
        const _n = new Uint8Array(15 * (5 - objs.length))
        for (let i = 0; i < 15 * (5 - objs.length); i++) {
            _n[i] = 0;
        }
        data = new Uint8Array([...data, ..._n]);
    }
    if (5 < objs.length && objs.length < 7) {
        const _n = new Uint8Array(15 * (7 - objs.length))
        for (let i = 0; i < 15 * (7 - objs.length); i++) {
            _n[i] = 0;
        }
        data = new Uint8Array([...data, ..._n]);
    }
    return data;
}

function textDataField(objs: objectType[]) : Uint8Array {
    let data = new Uint8Array([
        ...packObject(objs[0]), ...(new Uint8Array(30))
    ])
    if (objs[0].text) {
        for (let i = 15; i < objs[0].text.length + 15; i++) {
            data[i] = objs[0].text.charCodeAt(i);
        }
    }
    return data;
}

function dataField(objs: objectType[]) : Uint8Array {
    if (objs[0].text) {
        return textDataField(objs);
    }
    return normalDataField(objs);
}

let seq = 0;
const cmd_id = 0x0301;

function dataFieldToSerialMsg(data: Uint8Array) : Uint8Array {
    let header = new Uint8Array(13)
    let tail = new Uint8Array(2)
    header[0] = 0xA5;
    const length = data.length + 6;
    header[1] = length & 0xFF;
    header[2] = (length >> 8) & 0xFF;
    header[3] = seq;
    header[4] = calc_crc8(header.subarray(0, 4));
    header[5] = cmd_id & 0xFF;
    header[6] = (cmd_id >> 8) & 0xFF;
    let sub_id = 0;
    if (data.length === 2) {
        sub_id = 0x0100
    } else if (data.length === 15) {
        sub_id = 0x0101
    } else if (data.length === 30) {
        sub_id = 0x0102
    } else if (data.length === 75) {
        sub_id = 0x0103
    } else if (data.length === 105) {
        sub_id = 0x0104
    } else if (data.length === 45) {
        sub_id = 0x0110
    }
    header[7] = sub_id & 0xFF;
    header[8] = (sub_id >> 8) & 0xFF;
    header[9] = rid & 0xFF;
    header[10] = (rid >> 8) & 0xFF;
    header[11] = (rid + 256) & 0xFF;
    header[12] = ((rid + 256) >> 8) & 0xFF;
    let res = new Uint8Array([...header, ...data, ...tail]);
    let crc16 = calc_crc16(res.subarray(0, res.length - 2));
    res[res.length - 2] = crc16 & 0xFF;
    res[res.length - 1] = (crc16 >> 8) & 0xFF;
    seq++;
    if (seq >= 256) {
        seq = 0;
    }
    return res;
}

export function splitToSerialMsg(objs: objectType[]) : Uint8Array {
    let data = dataField(objs);
    return dataFieldToSerialMsg(data);
}

export function clearToSerialMsg() : Uint8Array {
    return dataFieldToSerialMsg(new Uint8Array([2, 0]));
}
