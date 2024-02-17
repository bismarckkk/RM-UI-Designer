//
// Created by bismarckkk on 2024/2/17.
//

#include "ui_default_ungroup1.h"

#define FRAME_ID 0
#define GROUP_ID 0
#define START_ID 0

#define OBJ_NUM 2
#define FRAME_OBJ_NUM 5

CAT(ui_, CAT(FRAME_OBJ_NUM, _frame_t)) ui_default_ungroup_1;

ui_interface_rect_t *ui_default_ungroup_rect = (ui_interface_rect_t *)&(ui_default_ungroup_1.data[0]);
ui_interface_arc_t *ui_default_ungroup_arc = (ui_interface_arc_t *)&(ui_default_ungroup_1.data[1]);

void ui_init_default_ungroup_1() {
    for (int i = 0; i < OBJ_NUM; i++) {
        ui_default_ungroup_1.data[i].figure_name[0] = FRAME_ID;
        ui_default_ungroup_1.data[i].figure_name[1] = GROUP_ID;
        ui_default_ungroup_1.data[i].figure_name[2] = i + START_ID;
        ui_default_ungroup_1.data[i].operate_tpyel = 1;
    }
    for (int i = OBJ_NUM; i < FRAME_OBJ_NUM; i++) {
        ui_default_ungroup_1.data[i].operate_tpyel = 0;
    }

    ui_default_ungroup_rect->figure_tpye = 1;
    ui_default_ungroup_rect->layer = 1;
    ui_default_ungroup_rect->color = 0;
    ui_default_ungroup_rect->width = 1;
    ui_default_ungroup_rect->start_x = 50;
    ui_default_ungroup_rect->start_y = 50;
    ui_default_ungroup_rect->end_x = 50;
    ui_default_ungroup_rect->end_y = 50;

    ui_default_ungroup_arc->figure_tpye = 4;
    ui_default_ungroup_arc->layer = 1;
    ui_default_ungroup_arc->color = 0;
    ui_default_ungroup_arc->width = 1;
    ui_default_ungroup_arc->start_x = 50;
    ui_default_ungroup_arc->start_y = 50;
    ui_default_ungroup_arc->rx = 50;
    ui_default_ungroup_arc->ry = 50;
    ui_default_ungroup_arc->start_angle = 0;
    ui_default_ungroup_arc->end_angle = 180;

    CAT(ui_proc_, CAT(FRAME_OBJ_NUM, _frame))(&ui_default_ungroup_1);
    SEND_MESSAGE((uint8_t *) &ui_default_ungroup_1, sizeof(ui_default_ungroup_1));
}

void ui_update_default_ungroup_1() {
    for (int i = 0; i < OBJ_NUM; i++) {
        ui_default_ungroup_1.data[i].operate_tpyel = 2;
    }

    CAT(ui_proc_, CAT(FRAME_OBJ_NUM, _frame))(&ui_default_ungroup_1);
    SEND_MESSAGE((uint8_t *) &ui_default_ungroup_1, sizeof(ui_default_ungroup_1));
}

void ui_remove_default_ungroup_1() {
    for (int i = 0; i < OBJ_NUM; i++) {
        ui_default_ungroup_1.data[i].operate_tpyel = 3;
    }

    CAT(ui_proc_, CAT(FRAME_OBJ_NUM, _frame))(&ui_default_ungroup_1);
    SEND_MESSAGE((uint8_t *) &ui_default_ungroup_1, sizeof(ui_default_ungroup_1));
}
