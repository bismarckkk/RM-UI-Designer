const N = "\n";
const fabricType2type = {
    "UiArc": "arc",
    "UiRound": "round",
    "UiRect": "rect",
    "UiLine": "line",
    "UiEllipse": "ellipse",
    "UiText": "string",
    "UiNumber": "number",
    "UiFloat": "number",
}
const fabricType2id = {
    "UiLine": 0,
    "UiRect": 1,
    "UiRound": 2,
    "UiEllipse": 3,
    "UiArc": 4,
    "UiFloat": 5,
    "UiNumber": 6,
    "UiText": 7,
}
const fabricKey2key = {
    'lineWidth': 'width',
    'layer': 'layer',
    'x': 'start_x',
    'y': 'start_y',
    'x2': 'end_x',
    'y2': 'end_y',
    'rx': 'rx',
    'ry': 'ry',
    'r': 'r',
    'startAngle': 'start_angle',
    'endAngle': 'end_angle',
    'number': 'number',
    'color': 'color',
    'fontSize': 'font_size',
    'strLength': 'str_length',
}
const color2id = {
    main: 0,
    yellow: 1,
    green: 2,
    orange: 3,
    purple: 4,
    pink: 5,
    cyan: 6,
    black: 7,
    white: 8,
}

export function ui_h(frames) {
    let res = `//${
        N}// Created by RM UI Designer${
        N}// Dynamic Edition${
        N}//${
        N}${
        N}#ifndef UI_H${
        N}#define UI_H${
        N}#ifdef __cplusplus${
        N}extern "C" {${
        N}#endif${
        N}${
        N}#include "ui_interface.h"${
        N}${
        N}`

    for (let frame of frames) {
        res += `#include "ui_${frame.name}.h"\n`;
    }

    return `${res}${
        N}#ifdef __cplusplus${
        N}}${
        N}#endif${
        N}${
        N}#endif //UI_H\n`
}

export function ui_frame_h(frame_name, objs, textObjs) {
    let res = `//${
        N}// Created by RM UI Designer${
        N}// Dynamic Edition${
        N}//${
        N}${
        N}#ifndef UI_${frame_name}_H${
        N}#define UI_${frame_name}_H${
        N}${
        N}#include "ui_interface.h"${
        N}${
        N}`

    for (let obj of objs) {
        res += `extern ui_interface_${fabricType2type[obj.type]}_t *ui_${frame_name}_${obj.group}_${obj.name};\n`
        res += `extern uint8_t *ui_${frame_name}_${obj.group}_${obj.name}_dirty;\n`
    }

    res += '\n';

    for (let obj of textObjs) {
        res += `extern ui_interface_${fabricType2type[obj.type]}_t *ui_${frame_name}_${obj.group}_${obj.name};\n`
        res += `extern uint8_t *ui_${frame_name}_${obj.group}_${obj.name}_dirty;\n`
    }

    res += `${
        N}void ui_init_${frame_name}();${
        N}void ui_update_${frame_name}();${
        N}${
        N}#endif //UI_${frame_name}_H${
        N}`
    return res
}

function ui_obj_c(frame_name, _obj) {
    let obj = {..._obj}
    const group_name = obj.group
    const name = obj.name
    const pointer = `ui_${frame_name}_${group_name}_${name}`
    obj.color = color2id[obj.color]

    if (_obj.type === "UiText") {
        const text = obj.text
        obj.strLength = text.length
        obj.lineWidth = Math.round(obj.fontSize / 10)
        delete obj.text
        delete obj.type
        delete obj.id
        delete obj.name
        delete obj.group

        let res = `    ${pointer}->figure_tpye = ${fabricType2id['UiText']};\n`
        for (let key in obj) {
            let value = obj[key]
            if (typeof value === "number") {
                value = Math.round(value)
            }
            res += `    ${pointer}->${fabricKey2key[key]} = ${value};\n`
        }
        res += `    strcpy(${pointer}->string, "${text}");\n\n`
        return res
    }

    const typeId = fabricType2id[obj.type]
    if (obj.type === "UiFloat") {
        obj.number = Math.round(obj.float * 1000)
        delete obj.float
    }
    if (obj.type === "UiRect") {
        obj.x2 = obj.x + obj.width
        obj.y2 = obj.y + obj.height
        delete obj.width
        delete obj.height
    }
    if (obj.type === 'UiFloat' || obj.type === 'UiNumber') {
        obj.lineWidth = Math.round(obj.fontSize / 10)
    }
    delete obj.type
    delete obj.id
    delete obj.name
    delete obj.group


    let res = `    ${pointer}->figure_tpye = ${typeId};\n`
    for (let key in obj) {
        let value = obj[key]
        if (typeof value === "number") {
            value = Math.round(value)
        }
        res += `    ${pointer}->${fabricKey2key[key]} = ${value};\n`
    }
    return `${res}\n`


}

export function ui_frame_c(frame_name, objs, textObjs) {
    let res = `//${
        N}// Created by RM UI Designer${
        N}// Dynamic Edition${
        N}//${
        N}${
        N}#include "string.h"${
        N}#include "ui_interface.h"${
        N}#include "ui_${frame_name}.h"${
        N}${
        N}// #define MANUAL_DIRTY${
        N}${
        N}#define TOTAL_FIGURE ${objs.length}${
        N}#define TOTAL_STRING ${textObjs.length}${
        N}${
        N}ui_interface_figure_t ui_now_figures[TOTAL_FIGURE];${
        N}ui_interface_string_t ui_now_strings[TOTAL_STRING];${
        N}uint8_t ui_dirty_figure[TOTAL_FIGURE];${
        N}uint8_t ui_dirty_string[TOTAL_STRING];${
        N}#ifndef MANUAL_DIRTY${
        N}ui_interface_figure_t ui_last_figures[TOTAL_FIGURE];${
        N}ui_interface_string_t ui_last_strings[TOTAL_STRING];${
        N}#endif${
        N}${
        N}`
    
    for (let i = 0; i < objs.length; i++) {
        const obj = objs[i]
        res += `ui_interface_${fabricType2type[obj.type]}_t *ui_${frame_name}_${obj.group}_${obj.name} = (ui_interface_${fabricType2type[obj.type]}_t*)&(ui_now_figures[${i}]);\n`
        res += `uint8_t *ui_${frame_name}_${obj.group}_${obj.name}_dirty = &(ui_dirty_figure[${i}]);\n`
    }
    res += '\n'

    for (let i = 0; i < textObjs.length; i++) {
        const obj = textObjs[i]
        res += `ui_interface_string_t *ui_${frame_name}_${obj.group}_${obj.name} = &(ui_now_strings[${i}]);\n`
        res += `uint8_t *ui_${frame_name}_${obj.group}_${obj.name}_dirty = &(ui_dirty_string[${i}]);\n`
    }
    res += `\nvoid scan_and_send_${frame_name}();\n\n`;

    res += `void ui_init_${frame_name}() {\n`

    for (let obj of objs) {
        res += ui_obj_c(frame_name, obj)
    }
    for (let obj of textObjs) {
        res += ui_obj_c(frame_name, obj)
    }
    
    res += `${
    N}    uint32_t idx = 0;${
    N}    for (int i = 0; i < TOTAL_FIGURE; i++) {${
    N}        ui_now_figures[i].figure_name[2] = idx & 0xFF;${
    N}        ui_now_figures[i].figure_name[1] = (idx >> 8) & 0xFF;${
    N}        ui_now_figures[i].figure_name[0] = (idx >> 16) & 0xFF;${
    N}        ui_now_figures[i].operate_tpyel = 1;${
    N}        ui_last_figures[i] = ui_now_figures[i];${
    N}        ui_dirty_figure[i] = 1;${
    N}        idx++;${
    N}    }${
    N}    for (int i = 0; i < TOTAL_STRING; i++) {${
    N}        ui_now_strings[i].figure_name[2] = idx & 0xFF;${
    N}        ui_now_strings[i].figure_name[1] = (idx >> 8) & 0xFF;${
    N}        ui_now_strings[i].figure_name[0] = (idx >> 16) & 0xFF;${
    N}        ui_now_strings[i].operate_tpyel = 1;${
    N}        ui_last_strings[i] = ui_now_strings[i];${
    N}        ui_dirty_string[i] = 1;${
    N}        idx++;${
    N}    }${
    N}${
    N}    scan_and_send_${frame_name}();${
    N}${
    N}    for (int i = 0; i < TOTAL_FIGURE; i++) {${
    N}        ui_now_figures[i].operate_tpyel = 2;${
    N}    }${
    N}    for (int i = 0; i < TOTAL_STRING; i++) {${
    N}        ui_now_strings[i].operate_tpyel = 2;${
    N}    }${
    N}}${
    N}${
    N}void ui_update_${frame_name}() {${
    N}#ifndef MANUAL_DIRTY${
    N}    for (int i = 0; i < TOTAL_FIGURE; i++) {${
    N}        if (memcmp(&ui_now_figures[i], &ui_last_figures[i], sizeof(ui_now_figures[i])) != 0) {${
    N}            ui_dirty_figure[i] = 1;${
    N}            ui_last_figures[i] = ui_now_figures[i];${
    N}        }${
    N}    }${
    N}    for (int i = 0; i < TOTAL_STRING; i++) {${
    N}        if (memcmp(&ui_now_strings[i], &ui_last_strings[i], sizeof(ui_now_strings[i])) != 0) {${
    N}            ui_dirty_string[i] = 1;${
    N}            ui_last_strings[i] = ui_now_strings[i];${
    N}        }${
    N}    }${
    N}#endif${
    N}    scan_and_send_${frame_name}();${
    N}}${
    N}${
    N}void scan_and_send_${frame_name}() {${
    N}    int total_figure = 0;${
    N}    for (int i = 0; i < TOTAL_FIGURE; i++) {${
    N}        if (ui_dirty_figure[i] == 1) {${
    N}            total_figure++;${
    N}        }${
    N}    }${
    N}    for (int i = 0, now_cap = 0, pack_size = 0; i < TOTAL_FIGURE; i++) {${
    N}        if (ui_dirty_figure[i] == 1) {${
    N}            const int now_idx = now_cap % 7;${
    N}            if (now_idx == 0) {${
    N}                const int remain_size = total_figure - now_cap;${
    N}                if (remain_size > 5) {${
    N}                    pack_size = 7;${
    N}                } else if (remain_size > 2) {${
    N}                    pack_size = 5;${
    N}                } else if (remain_size > 1) {${
    N}                    pack_size = 2;${
    N}                } else {${
    N}                    pack_size = 1;${
    N}                }${
    N}            }${
    N}            if (pack_size == 7) {${
    N}                _ui_7_frame.data[now_idx] = ui_now_figures[i];${
    N}            } else if (pack_size == 5) {${
    N}                _ui_5_frame.data[now_idx] = ui_now_figures[i];${
    N}            } else if (pack_size == 2) {${
    N}                _ui_2_frame.data[now_idx] = ui_now_figures[i];${
    N}            } else {${
    N}                _ui_1_frame.data[now_idx] = ui_now_figures[i];${
    N}            }${
    N}            if (now_idx + 1 == pack_size || now_cap + 1 == total_figure) {${
    N}                for (int j = now_idx + 1; j < pack_size + 1; j++) {${
    N}                    if (pack_size == 7) {${
    N}                        _ui_7_frame.data[j].operate_tpyel = 0;${
    N}                    } else if (pack_size == 5) {${
    N}                        _ui_5_frame.data[j].operate_tpyel = 0;${
    N}                    } else if (pack_size == 2) {${
    N}                        _ui_2_frame.data[j].operate_tpyel = 0;${
    N}                    } else {${
    N}                        _ui_1_frame.data[j].operate_tpyel = 0;${
    N}                    }${
    N}                }${
    N}                if (pack_size == 7) {${
    N}                    ui_proc_7_frame(&_ui_7_frame);${
    N}                    SEND_MESSAGE((uint8_t *) &_ui_7_frame, sizeof(_ui_7_frame));${
    N}                } else if (pack_size == 5) {${
    N}                    ui_proc_5_frame(&_ui_5_frame);${
    N}                    SEND_MESSAGE((uint8_t *) &_ui_5_frame, sizeof(_ui_5_frame));${
    N}                } else if (pack_size == 2) {${
    N}                    ui_proc_2_frame(&_ui_2_frame);${
    N}                    SEND_MESSAGE((uint8_t *) &_ui_2_frame, sizeof(_ui_2_frame));${
    N}                } else {${
    N}                    ui_proc_1_frame(&_ui_1_frame);${
    N}                    SEND_MESSAGE((uint8_t *) &_ui_1_frame, sizeof(_ui_1_frame));${
    N}                }${
    N}            }${
    N}            now_cap++;${
    N}            ui_dirty_figure[i] = 0;${
    N}        }${
    N}    }${
    N}    for (int i = 0; i < TOTAL_STRING; i++) {${
    N}        if (ui_dirty_string[i] == 1) {${
    N}            _ui_string_frame.option = ui_last_strings[i];${
    N}            ui_proc_string_frame(&_ui_string_frame);${
    N}            SEND_MESSAGE((uint8_t *) &_ui_string_frame, sizeof(_ui_string_frame));${
    N}            ui_dirty_string[i] = 0;${
    N}        }${
    N}    }${
    N}}${
    N}`

    return res
}

const interfaceHUrl = require('@/assets/code_template/dynamic/ui_interface.h')
const interfaceCUrl = require('@/assets/code_template/dynamic/ui_interface.c')
const typesHUrl = require('@/assets/code_template/dynamic/ui_types.h')

let interfaceH = await (await fetch(interfaceHUrl)).text()
let interfaceC = await (await fetch(interfaceCUrl)).text()
let typesH = await (await fetch(typesHUrl)).text()

export async function getUiBase() {
    return {
        ui_interface: {
            h: interfaceH,
            c: interfaceC
        },
        ui_types: {
            h: typesH
        }
    }
}
