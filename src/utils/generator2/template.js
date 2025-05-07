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
        N}#if ${objs.length} != 0${
        N}extern ui_interface_figure_t ui_${frame_name}_now_figures[${objs.length}];${
        N}extern uint8_t ui_${frame_name}_dirty_figure[${objs.length}];${
        N}#endif${
        N}#if ${textObjs.length} != 0${
        N}extern ui_interface_string_t ui_${frame_name}_now_strings[${textObjs.length}];${
        N}extern uint8_t ui_${frame_name}_dirty_string[${textObjs.length}];${
        N}#endif${
        N}${
        N}`

    for (let i = 0; i < objs.length; i++) {
        const obj = objs[i]
        res += `#define ui_${frame_name}_${obj.group}_${obj.name} ((ui_interface_${fabricType2type[obj.type]}_t*)&(ui_${frame_name}_now_figures[${i}]))\n`
    }

    res += '\n';

    for (let i = 0; i < textObjs.length; i++) {
        const obj = textObjs[i]
        res += `#define ui_${frame_name}_${obj.group}_${obj.name} (&(ui_${frame_name}_now_strings[${i}]))\n`
    }
    res += '\n#ifdef MANUAL_DIRTY\n';

    for (let i = 0; i < objs.length; i++) {
        const obj = objs[i]
        res += `#define ui_${frame_name}_${obj.group}_${obj.name}_dirty (ui_${frame_name}_dirty_figure[${i}])\n`
    }
    res += '\n';

    for (let i = 0; i < textObjs.length; i++) {
        const obj = textObjs[i]
        res += `#define ui_${frame_name}_${obj.group}_${obj.name}_dirty (ui_${frame_name}_dirty_string[${i}])\n`
    }

    res += `#endif\n`

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

        let res = `    ${pointer}->figure_type = ${fabricType2id['UiText']};\n`
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


    let res = `    ${pointer}->figure_type = ${typeId};\n`
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
        N}#define TOTAL_FIGURE ${objs.length}${
        N}#define TOTAL_STRING ${textObjs.length}${
        N}${
        N}#if TOTAL_FIGURE != 0${
        N}ui_interface_figure_t ui_${frame_name}_now_figures[TOTAL_FIGURE];${
        N}uint8_t ui_${frame_name}_dirty_figure[TOTAL_FIGURE];${
        N}#endif${
        N}#if TOTAL_STRING != 0${
        N}ui_interface_string_t ui_${frame_name}_now_strings[TOTAL_STRING];${
        N}uint8_t ui_${frame_name}_dirty_string[TOTAL_STRING];${
        N}#endif${
        N}${
        N}#ifndef MANUAL_DIRTY${
        N}#if TOTAL_FIGURE != 0${
        N}ui_interface_figure_t ui_${frame_name}_last_figures[TOTAL_FIGURE];${
        N}#endif${
        N}#if TOTAL_STRING != 0${
        N}ui_interface_string_t ui_${frame_name}_last_strings[TOTAL_STRING];${
        N}#endif${
        N}#endif${
        N}${
        N}#if TOTAL_FIGURE != 0 && TOTAL_STRING != 0${
        N}#define SCAN_AND_SEND() ui_scan_and_send(ui_g_now_figures, ui_g_dirty_figure, ui_g_now_strings, ui_g_dirty_string, TOTAL_FIGURE, TOTAL_STRING)${
        N}#elif TOTAL_FIGURE != 0${
        N}#define SCAN_AND_SEND() ui_scan_and_send(ui_g_now_figures, ui_g_dirty_figure, NULL, NULL, TOTAL_FIGURE, TOTAL_STRING)${
        N}#elif TOTAL_STRING != 0${
        N}#define SCAN_AND_SEND() ui_scan_and_send(NULL, NULL, ui_g_now_strings, ui_g_dirty_string, TOTAL_FIGURE, TOTAL_STRING)${
        N}#endif${
        N}${
        N}`

    res += `void ui_init_${frame_name}() {\n`

    for (let obj of objs) {
        res += ui_obj_c(frame_name, obj)
    }
    for (let obj of textObjs) {
        res += ui_obj_c(frame_name, obj)
    }
    
    res += `${
    N}    uint32_t idx = 0;${
    N}#if TOTAL_FIGURE != 0${
    N}    for (int i = 0; i < TOTAL_FIGURE; i++) {${
    N}        ui_${frame_name}_now_figures[i].figure_name[2] = idx & 0xFF;${
    N}        ui_${frame_name}_now_figures[i].figure_name[1] = (idx >> 8) & 0xFF;${
    N}        ui_${frame_name}_now_figures[i].figure_name[0] = (idx >> 16) & 0xFF;${
    N}        ui_${frame_name}_now_figures[i].operate_type = 1;${
    N}#ifndef MANUAL_DIRTY${
    N}        ui_${frame_name}_last_figures[i] = ui_${frame_name}_now_figures[i];${
    N}#endif${
    N}        ui_${frame_name}_dirty_figure[i] = 1;${
    N}        idx++;${
    N}    }${
    N}#endif${
    N}#if TOTAL_STRING != 0${
    N}    for (int i = 0; i < TOTAL_STRING; i++) {${
    N}        ui_${frame_name}_now_strings[i].figure_name[2] = idx & 0xFF;${
    N}        ui_${frame_name}_now_strings[i].figure_name[1] = (idx >> 8) & 0xFF;${
    N}        ui_${frame_name}_now_strings[i].figure_name[0] = (idx >> 16) & 0xFF;${
    N}        ui_${frame_name}_now_strings[i].operate_type = 1;${
    N}#ifndef MANUAL_DIRTY${
    N}        ui_${frame_name}_last_strings[i] = ui_${frame_name}_now_strings[i];${
    N}#endif${
    N}        ui_${frame_name}_dirty_string[i] = 1;${
    N}        idx++;${
    N}    }${
    N}#endif${
    N}${
    N}    SCAN_AND_SEND();${
    N}${
    N}#if TOTAL_FIGURE != 0${
    N}    for (int i = 0; i < TOTAL_FIGURE; i++) {${
    N}        ui_${frame_name}_now_figures[i].operate_type = 2;${
    N}    }${
    N}#endif${
    N}#if TOTAL_STRING != 0${
    N}    for (int i = 0; i < TOTAL_STRING; i++) {${
    N}        ui_${frame_name}_now_strings[i].operate_type = 2;${
    N}    }${
    N}#endif${
    N}}${
    N}${
    N}void ui_update_${frame_name}() {${
    N}#ifndef MANUAL_DIRTY${
    N}#if TOTAL_FIGURE != 0${
    N}    for (int i = 0; i < TOTAL_FIGURE; i++) {${
    N}        if (memcmp(&ui_${frame_name}_now_figures[i], &ui_${frame_name}_last_figures[i], sizeof(ui_${frame_name}_now_figures[i])) != 0) {${
    N}            ui_${frame_name}_dirty_figure[i] = 1;${
    N}            ui_${frame_name}_last_figures[i] = ui_${frame_name}_now_figures[i];${
    N}        }${
    N}    }${
    N}#endif${
    N}#if TOTAL_STRING != 0${
    N}    for (int i = 0; i < TOTAL_STRING; i++) {${
    N}        if (memcmp(&ui_${frame_name}_now_strings[i], &ui_${frame_name}_last_strings[i], sizeof(ui_${frame_name}_now_strings[i])) != 0) {${
    N}            ui_${frame_name}_dirty_string[i] = 1;${
    N}            ui_${frame_name}_last_strings[i] = ui_${frame_name}_now_strings[i];${
    N}        }${
    N}    }${
    N}#endif${
    N}#endif${
    N}    SCAN_AND_SEND();${
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
