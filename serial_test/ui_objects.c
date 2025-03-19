//
// Created by abc55 on 2025/3/19.
//

#include "ui_objects.h"
#include <string.h>

#include "ui_interface.h"

// #define MANUAL_DIRTY

#define TOTAL_FIGURE 4
#define TOTAL_STRING 2

ui_interface_figure_t ui_now_figures[TOTAL_FIGURE];
ui_interface_string_t ui_now_strings[TOTAL_STRING];
uint8_t ui_dirty_figure[TOTAL_FIGURE];
ui_interface_figure_t ui_last_figures[TOTAL_FIGURE];
ui_interface_string_t ui_last_strings[TOTAL_STRING];
uint8_t ui_dirty_string[TOTAL_STRING];

ui_interface_rect_t *ui_default_ungroup_rect = (ui_interface_rect_t *)&(ui_now_figures[0]);
uint8_t *ui_default_ungroup_rect_dirty = &(ui_dirty_figure[0]);
ui_interface_arc_t *ui_default_ungroup_arc = (ui_interface_arc_t *)&(ui_now_figures[1]);
uint8_t *ui_default_ungroup_arc_dirty = &(ui_dirty_figure[1]);
ui_interface_string_t *ui_default_ungroup_string = &(ui_now_strings[0]);
uint8_t *ui_default_ungroup_string_dirty = &(ui_dirty_string[0]);
ui_interface_string_t *ui_default_Ungroup_NewText = &(ui_now_strings[1]);
uint8_t *ui_default_Ungroup_NewText_dirty = &(ui_dirty_string[1]);
ui_interface_line_t *ui_default_Ungroup_NewLine = (ui_interface_line_t *)&(ui_now_figures[2]);
uint8_t *ui_default_Ungroup_NewLine_dirty = &(ui_dirty_figure[2]);
ui_interface_rect_t *ui_default_Ungroup_NewRect = (ui_interface_rect_t *)&(ui_now_figures[3]);
uint8_t *ui_default_Ungroup_NewRect_dirty = &(ui_dirty_figure[3]);

void scan_and_send() {
    int total_figure = 0;
    for (int i = 0; i < TOTAL_FIGURE; i++) {
        if (ui_dirty_figure[i] == 1) {
            total_figure++;
        }
    }
    for (int i = 0, now_cap = 0, pack_size = 0; i < TOTAL_FIGURE; i++) {
        if (ui_dirty_figure[i] == 1) {
            const int now_idx = now_cap % 7;
            if (now_idx == 0) {
                const int remain_size = total_figure - now_cap;
                if (remain_size > 5) {
                    pack_size = 7;
                    memset(&_ui_7_frame, 0, sizeof(_ui_7_frame));
                } else if (remain_size > 2) {
                    pack_size = 5;
                    memset(&_ui_5_frame, 0, sizeof(_ui_5_frame));
                } else if (remain_size > 1) {
                    pack_size = 2;
                    memset(&_ui_2_frame, 0, sizeof(_ui_2_frame));
                } else {
                    pack_size = 1;
                }
            }
            if (pack_size == 7) {
                _ui_7_frame.data[now_idx] = ui_now_figures[i];
            } else if (pack_size == 5) {
                _ui_5_frame.data[now_idx] = ui_now_figures[i];
            } else if (pack_size == 2) {
                _ui_2_frame.data[now_idx] = ui_now_figures[i];
            } else {
                _ui_1_frame.data[now_idx] = ui_now_figures[i];
            }
            if (now_idx + 1 == pack_size || now_idx + 1 == total_figure) {
                if (pack_size == 7) {
                    ui_proc_7_frame(&_ui_7_frame);
                    SEND_MESSAGE((uint8_t *) &_ui_7_frame, sizeof(_ui_7_frame));
                } else if (pack_size == 5) {
                    ui_proc_5_frame(&_ui_5_frame);
                    SEND_MESSAGE((uint8_t *) &_ui_5_frame, sizeof(_ui_5_frame));
                } else if (pack_size == 2) {
                    ui_proc_2_frame(&_ui_2_frame);
                    SEND_MESSAGE((uint8_t *) &_ui_2_frame, sizeof(_ui_2_frame));
                } else {
                    ui_proc_1_frame(&_ui_1_frame);
                    SEND_MESSAGE((uint8_t *) &_ui_1_frame, sizeof(_ui_1_frame));
                }
            }
            now_cap++;
            ui_dirty_figure[i] = 0;
        }
    }
    for (int i = 0; i < TOTAL_STRING; i++) {
        if (ui_dirty_string[i] == 1) {
            _ui_string_frame.option = ui_last_strings[i];
            ui_proc_string_frame(&_ui_string_frame);
            SEND_MESSAGE((uint8_t *) &_ui_string_frame, sizeof(_ui_string_frame));
            ui_dirty_string[i] = 0;
        }
    }
}

void ui_objects_init() {
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

    ui_default_ungroup_string->figure_tpye = 7;
    ui_default_ungroup_string->layer = 0;
    ui_default_ungroup_string->font_size = 26;
    ui_default_ungroup_string->start_x = 1060;
    ui_default_ungroup_string->start_y = 850;
    ui_default_ungroup_string->color = 2;
    ui_default_ungroup_string->str_length = 7;
    ui_default_ungroup_string->width = 3;
    strcpy(ui_default_ungroup_string->string, "Hello, World!");

    ui_default_Ungroup_NewText->figure_tpye = 7;
    ui_default_Ungroup_NewText->layer = 0;
    ui_default_Ungroup_NewText->font_size = 26;
    ui_default_Ungroup_NewText->start_x = 100;
    ui_default_Ungroup_NewText->start_y = 80;
    ui_default_Ungroup_NewText->color = 2;
    ui_default_Ungroup_NewText->str_length = 7;
    ui_default_Ungroup_NewText->width = 3;
    strcpy(ui_default_Ungroup_NewText->string, "22222");

    ui_default_Ungroup_NewLine->figure_tpye = 0;
    ui_default_Ungroup_NewLine->layer = 0;
    ui_default_Ungroup_NewLine->start_x = 683;
    ui_default_Ungroup_NewLine->start_y = 423;
    ui_default_Ungroup_NewLine->end_x = 908;
    ui_default_Ungroup_NewLine->end_y = 648;
    ui_default_Ungroup_NewLine->color = 0;
    ui_default_Ungroup_NewLine->width = 1;

    ui_default_Ungroup_NewRect->figure_tpye = 1;
    ui_default_Ungroup_NewRect->layer = 0;
    ui_default_Ungroup_NewRect->start_x = 1148;
    ui_default_Ungroup_NewRect->start_y = 640;
    ui_default_Ungroup_NewRect->color = 0;
    ui_default_Ungroup_NewRect->width = 1;
    ui_default_Ungroup_NewRect->end_x = 1198;
    ui_default_Ungroup_NewRect->end_y = 690;

    uint32_t idx = 0;
    for (int i = 0; i < TOTAL_FIGURE; i++) {
        ui_now_figures[i].figure_name[2] = idx & 0xFF;
        ui_now_figures[i].figure_name[1] = (idx >> 8) & 0xFF;
        ui_now_figures[i].figure_name[0] = (idx >> 16) & 0xFF;
        ui_now_figures[i].operate_tpyel = 1;
        ui_last_figures[i] = ui_now_figures[i];
        ui_dirty_figure[i] = 1;
        idx++;
    }
    for (int i = 0; i < TOTAL_STRING; i++) {
        ui_now_strings[i].figure_name[2] = idx & 0xFF;
        ui_now_strings[i].figure_name[1] = (idx >> 8) & 0xFF;
        ui_now_strings[i].figure_name[0] = (idx >> 16) & 0xFF;
        ui_now_strings[i].operate_tpyel = 1;
        ui_last_strings[i] = ui_now_strings[i];
        ui_dirty_string[i] = 1;
        idx++;
    }

    scan_and_send();

    for (int i = 0; i < TOTAL_FIGURE; i++) {
        ui_now_figures[i].operate_tpyel = 2;
    }
    for (int i = 0; i < TOTAL_STRING; i++) {
        ui_now_strings[i].operate_tpyel = 2;
    }
}

void ui_objects_update() {
#ifndef MANUAL_DIRTY
    for (int i = 0; i < TOTAL_FIGURE; i++) {
        if (memcmp(&ui_now_figures[i], &ui_last_figures[i], sizeof(ui_now_figures[i])) != 0) {
            ui_dirty_figure[i] = 1;
            ui_last_figures[i] = ui_now_figures[i];
        }
    }
    for (int i = 0; i < TOTAL_STRING; i++) {
        if (memcmp(&ui_now_strings[i], &ui_last_strings[i], sizeof(ui_now_strings[i])) != 0) {
            ui_dirty_string[i] = 1;
            ui_last_strings[i] = ui_now_strings[i];
        }
    }
#endif
    scan_and_send();
}
