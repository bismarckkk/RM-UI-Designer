//
// Created by bismarckkk on 2024/2/17.
//

#include "ui_default_ungroup1.h"
#include <string.h>

#define FRAME_ID 0
#define GROUP_ID 1
#define START_ID 3

#define OBJ_NUM 2

ui_string_frame_t ui_default_ungroup_2;

char* ui_default_ungroup_string = ui_default_ungroup_2.string;

void _ui_init_default_ungroup_2() {
    ui_default_ungroup_2.option.figure_name[0] = FRAME_ID;
    ui_default_ungroup_2.option.figure_name[1] = GROUP_ID;
    ui_default_ungroup_2.option.figure_name[2] = START_ID;
    ui_default_ungroup_2.option.operate_tpyel = 1;

    strcpy(ui_default_ungroup_string, "Hello, World!");

    ui_proc_string_frame(&ui_default_ungroup_2);
    SEND_MESSAGE((uint8_t *) &ui_default_ungroup_2, sizeof(ui_default_ungroup_2));
}

void _ui_update_default_ungroup_2() {
    ui_default_ungroup_2.option.operate_tpyel = 2;

    ui_proc_string_frame(&ui_default_ungroup_2);
    SEND_MESSAGE((uint8_t *) &ui_default_ungroup_2, sizeof(ui_default_ungroup_2));
}

void _ui_remove_default_ungroup_2() {
    ui_default_ungroup_2.option.operate_tpyel = 2;

    ui_proc_string_frame(&ui_default_ungroup_2);
    SEND_MESSAGE((uint8_t *) &ui_default_ungroup_2, sizeof(ui_default_ungroup_2));
}
