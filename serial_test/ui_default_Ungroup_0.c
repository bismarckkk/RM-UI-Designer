//
// Created by RM UI Designer
//

#include "ui_default_Ungroup_0.h"
#include <string.h>

#define FRAME_ID 0
#define GROUP_ID 0
#define START_ID 0

ui_string_frame_t ui_default_Ungroup_0;

char* ui_default_Ungroup_NewText = ui_default_Ungroup_0.string;

void _ui_init_default_Ungroup_0() {
    ui_default_Ungroup_0.option.figure_name[0] = FRAME_ID;
    ui_default_Ungroup_0.option.figure_name[1] = GROUP_ID;
    ui_default_Ungroup_0.option.figure_name[2] = START_ID;
    ui_default_Ungroup_0.option.operate_tpyel = 1;
    ui_default_Ungroup_0.option.figure_tpye = 7;
    ui_default_Ungroup_0.option.layer = 0;
    ui_default_Ungroup_0.option.font_size = 50;
    ui_default_Ungroup_0.option.start_x = 303;
    ui_default_Ungroup_0.option.start_y = 510;
    ui_default_Ungroup_0.option.color = 1;
    ui_default_Ungroup_0.option.str_length = 4;
    ui_default_Ungroup_0.option.width = 5;
    strcpy(ui_default_Ungroup_NewText, "Text");

    ui_proc_string_frame(&ui_default_Ungroup_0);
    SEND_MESSAGE((uint8_t *) &ui_default_Ungroup_0, sizeof(ui_default_Ungroup_0));
}

void _ui_update_default_Ungroup_0() {
    ui_default_Ungroup_0.option.operate_tpyel = 2;

    ui_proc_string_frame(&ui_default_Ungroup_0);
    SEND_MESSAGE((uint8_t *) &ui_default_Ungroup_0, sizeof(ui_default_Ungroup_0));
}

void _ui_remove_default_Ungroup_0() {
    ui_default_Ungroup_0.option.operate_tpyel = 3;

    ui_proc_string_frame(&ui_default_Ungroup_0);
    SEND_MESSAGE((uint8_t *) &ui_default_Ungroup_0, sizeof(ui_default_Ungroup_0));
}