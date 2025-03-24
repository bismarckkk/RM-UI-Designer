//
// Created by RM UI Designer
// Dynamic Edition
//

#include "string.h"
#include "ui_interface.h"
#include "ui_g.h"

#define TOTAL_FIGURE 13
#define TOTAL_STRING 16

ui_interface_figure_t ui_g_now_figures[TOTAL_FIGURE];
ui_interface_string_t ui_g_now_strings[TOTAL_STRING];
uint8_t ui_g_dirty_figure[TOTAL_FIGURE];
uint8_t ui_g_dirty_string[TOTAL_STRING];
#ifndef MANUAL_DIRTY
ui_interface_figure_t ui_g_last_figures[TOTAL_FIGURE];
ui_interface_string_t ui_g_last_strings[TOTAL_STRING];
#endif

void ui_init_g() {
    ui_g_Ungroup_NewArc->figure_tpye = 4;
    ui_g_Ungroup_NewArc->layer = 0;
    ui_g_Ungroup_NewArc->rx = 210;
    ui_g_Ungroup_NewArc->ry = 210;
    ui_g_Ungroup_NewArc->start_x = 1920;
    ui_g_Ungroup_NewArc->start_y = 600;
    ui_g_Ungroup_NewArc->color = 1;
    ui_g_Ungroup_NewArc->width = 5;
    ui_g_Ungroup_NewArc->start_angle = 180;
    ui_g_Ungroup_NewArc->end_angle = 0;

    ui_g_Ungroup_NewLine1->figure_tpye = 0;
    ui_g_Ungroup_NewLine1->layer = 0;
    ui_g_Ungroup_NewLine1->start_x = 1868;
    ui_g_Ungroup_NewLine1->start_y = 453;
    ui_g_Ungroup_NewLine1->end_x = 1930;
    ui_g_Ungroup_NewLine1->end_y = 597;
    ui_g_Ungroup_NewLine1->color = 0;
    ui_g_Ungroup_NewLine1->width = 5;

    ui_g_Ungroup_NewLine2->figure_tpye = 0;
    ui_g_Ungroup_NewLine2->layer = 0;
    ui_g_Ungroup_NewLine2->start_x = 1809;
    ui_g_Ungroup_NewLine2->start_y = 515;
    ui_g_Ungroup_NewLine2->end_x = 1928;
    ui_g_Ungroup_NewLine2->end_y = 601;
    ui_g_Ungroup_NewLine2->color = 0;
    ui_g_Ungroup_NewLine2->width = 5;

    ui_g_Ungroup_NewLine3->figure_tpye = 0;
    ui_g_Ungroup_NewLine3->layer = 0;
    ui_g_Ungroup_NewLine3->start_x = 1772;
    ui_g_Ungroup_NewLine3->start_y = 612;
    ui_g_Ungroup_NewLine3->end_x = 1928;
    ui_g_Ungroup_NewLine3->end_y = 614;
    ui_g_Ungroup_NewLine3->color = 0;
    ui_g_Ungroup_NewLine3->width = 5;

    ui_g_Ungroup_NewRect4->figure_tpye = 1;
    ui_g_Ungroup_NewRect4->layer = 0;
    ui_g_Ungroup_NewRect4->start_x = 650;
    ui_g_Ungroup_NewRect4->start_y = 841;
    ui_g_Ungroup_NewRect4->color = 0;
    ui_g_Ungroup_NewRect4->width = 3;
    ui_g_Ungroup_NewRect4->end_x = 747;
    ui_g_Ungroup_NewRect4->end_y = 887;

    ui_g_Ungroup_NewRect5->figure_tpye = 1;
    ui_g_Ungroup_NewRect5->layer = 0;
    ui_g_Ungroup_NewRect5->start_x = 855;
    ui_g_Ungroup_NewRect5->start_y = 841;
    ui_g_Ungroup_NewRect5->color = 0;
    ui_g_Ungroup_NewRect5->width = 3;
    ui_g_Ungroup_NewRect5->end_x = 952;
    ui_g_Ungroup_NewRect5->end_y = 887;

    ui_g_Ungroup_NewRect6->figure_tpye = 1;
    ui_g_Ungroup_NewRect6->layer = 0;
    ui_g_Ungroup_NewRect6->start_x = 1055;
    ui_g_Ungroup_NewRect6->start_y = 841;
    ui_g_Ungroup_NewRect6->color = 0;
    ui_g_Ungroup_NewRect6->width = 3;
    ui_g_Ungroup_NewRect6->end_x = 1152;
    ui_g_Ungroup_NewRect6->end_y = 887;

    ui_g_Ungroup_NewRect7->figure_tpye = 1;
    ui_g_Ungroup_NewRect7->layer = 0;
    ui_g_Ungroup_NewRect7->start_x = 1250;
    ui_g_Ungroup_NewRect7->start_y = 841;
    ui_g_Ungroup_NewRect7->color = 0;
    ui_g_Ungroup_NewRect7->width = 3;
    ui_g_Ungroup_NewRect7->end_x = 1347;
    ui_g_Ungroup_NewRect7->end_y = 887;

    ui_g_Ungroup_NewRect8->figure_tpye = 1;
    ui_g_Ungroup_NewRect8->layer = 0;
    ui_g_Ungroup_NewRect8->start_x = 806;
    ui_g_Ungroup_NewRect8->start_y = 185;
    ui_g_Ungroup_NewRect8->color = 6;
    ui_g_Ungroup_NewRect8->width = 3;
    ui_g_Ungroup_NewRect8->end_x = 1164;
    ui_g_Ungroup_NewRect8->end_y = 235;

    ui_g_Ungroup_NewRect9->figure_tpye = 1;
    ui_g_Ungroup_NewRect9->layer = 0;
    ui_g_Ungroup_NewRect9->start_x = 657;
    ui_g_Ungroup_NewRect9->start_y = 602;
    ui_g_Ungroup_NewRect9->color = 3;
    ui_g_Ungroup_NewRect9->width = 20;
    ui_g_Ungroup_NewRect9->end_x = 668;
    ui_g_Ungroup_NewRect9->end_y = 609;

    ui_g_Ungroup_NewRect10->figure_tpye = 1;
    ui_g_Ungroup_NewRect10->layer = 0;
    ui_g_Ungroup_NewRect10->start_x = 659;
    ui_g_Ungroup_NewRect10->start_y = 480;
    ui_g_Ungroup_NewRect10->color = 3;
    ui_g_Ungroup_NewRect10->width = 20;
    ui_g_Ungroup_NewRect10->end_x = 670;
    ui_g_Ungroup_NewRect10->end_y = 487;

    ui_g_AIM_SHOW_aim_ID->figure_tpye = 6;
    ui_g_AIM_SHOW_aim_ID->layer = 0;
    ui_g_AIM_SHOW_aim_ID->font_size = 20;
    ui_g_AIM_SHOW_aim_ID->start_x = 691;
    ui_g_AIM_SHOW_aim_ID->start_y = 604;
    ui_g_AIM_SHOW_aim_ID->color = 4;
    ui_g_AIM_SHOW_aim_ID->number = 12345;
    ui_g_AIM_SHOW_aim_ID->width = 2;

    ui_g_AIM_SHOW_robo_HP->figure_tpye = 6;
    ui_g_AIM_SHOW_robo_HP->layer = 0;
    ui_g_AIM_SHOW_robo_HP->font_size = 20;
    ui_g_AIM_SHOW_robo_HP->start_x = 938;
    ui_g_AIM_SHOW_robo_HP->start_y = 679;
    ui_g_AIM_SHOW_robo_HP->color = 0;
    ui_g_AIM_SHOW_robo_HP->number = 12345;
    ui_g_AIM_SHOW_robo_HP->width = 2;

    ui_g_Text_GIMPOWER->figure_tpye = 7;
    ui_g_Text_GIMPOWER->layer = 1;
    ui_g_Text_GIMPOWER->font_size = 26;
    ui_g_Text_GIMPOWER->start_x = 68;
    ui_g_Text_GIMPOWER->start_y = 827;
    ui_g_Text_GIMPOWER->color = 6;
    ui_g_Text_GIMPOWER->str_length = 8;
    ui_g_Text_GIMPOWER->width = 3;
    strcpy(ui_g_Text_GIMPOWER->string, "GIMPOWER");

    ui_g_Text_POWERLIM->figure_tpye = 7;
    ui_g_Text_POWERLIM->layer = 0;
    ui_g_Text_POWERLIM->font_size = 26;
    ui_g_Text_POWERLIM->start_x = 67;
    ui_g_Text_POWERLIM->start_y = 781;
    ui_g_Text_POWERLIM->color = 6;
    ui_g_Text_POWERLIM->str_length = 8;
    ui_g_Text_POWERLIM->width = 3;
    strcpy(ui_g_Text_POWERLIM->string, "POWERLIM");

    ui_g_Text_SPEEDLIM->figure_tpye = 7;
    ui_g_Text_SPEEDLIM->layer = 0;
    ui_g_Text_SPEEDLIM->font_size = 26;
    ui_g_Text_SPEEDLIM->start_x = 65;
    ui_g_Text_SPEEDLIM->start_y = 734;
    ui_g_Text_SPEEDLIM->color = 6;
    ui_g_Text_SPEEDLIM->str_length = 8;
    ui_g_Text_SPEEDLIM->width = 3;
    strcpy(ui_g_Text_SPEEDLIM->string, "SPEEDLIM");

    ui_g_Text_NORMAL->figure_tpye = 7;
    ui_g_Text_NORMAL->layer = 0;
    ui_g_Text_NORMAL->font_size = 26;
    ui_g_Text_NORMAL->start_x = 661;
    ui_g_Text_NORMAL->start_y = 921;
    ui_g_Text_NORMAL->color = 2;
    ui_g_Text_NORMAL->str_length = 6;
    ui_g_Text_NORMAL->width = 3;
    strcpy(ui_g_Text_NORMAL->string, "NORMAL");

    ui_g_Text_SMLBUFF->figure_tpye = 7;
    ui_g_Text_SMLBUFF->layer = 0;
    ui_g_Text_SMLBUFF->font_size = 26;
    ui_g_Text_SMLBUFF->start_x = 860;
    ui_g_Text_SMLBUFF->start_y = 850;
    ui_g_Text_SMLBUFF->color = 2;
    ui_g_Text_SMLBUFF->str_length = 7;
    ui_g_Text_SMLBUFF->width = 3;
    strcpy(ui_g_Text_SMLBUFF->string, "SMLBUFF");

    ui_g_Text_LARBUFF->figure_tpye = 7;
    ui_g_Text_LARBUFF->layer = 0;
    ui_g_Text_LARBUFF->font_size = 26;
    ui_g_Text_LARBUFF->start_x = 1060;
    ui_g_Text_LARBUFF->start_y = 850;
    ui_g_Text_LARBUFF->color = 2;
    ui_g_Text_LARBUFF->str_length = 7;
    ui_g_Text_LARBUFF->width = 3;
    strcpy(ui_g_Text_LARBUFF->string, "LARBUFF");

    ui_g_Text_ANTIRO->figure_tpye = 7;
    ui_g_Text_ANTIRO->layer = 0;
    ui_g_Text_ANTIRO->font_size = 26;
    ui_g_Text_ANTIRO->start_x = 1260;
    ui_g_Text_ANTIRO->start_y = 850;
    ui_g_Text_ANTIRO->color = 2;
    ui_g_Text_ANTIRO->str_length = 6;
    ui_g_Text_ANTIRO->width = 3;
    strcpy(ui_g_Text_ANTIRO->string, "ANTIRO");

    ui_g_Text_LOCK->figure_tpye = 7;
    ui_g_Text_LOCK->layer = 0;
    ui_g_Text_LOCK->font_size = 24;
    ui_g_Text_LOCK->start_x = 598;
    ui_g_Text_LOCK->start_y = 598;
    ui_g_Text_LOCK->color = 2;
    ui_g_Text_LOCK->str_length = 4;
    ui_g_Text_LOCK->width = 2;
    strcpy(ui_g_Text_LOCK->string, "LOCK");

    ui_g_Text_FRIC->figure_tpye = 7;
    ui_g_Text_FRIC->layer = 0;
    ui_g_Text_FRIC->font_size = 24;
    ui_g_Text_FRIC->start_x = 598;
    ui_g_Text_FRIC->start_y = 476;
    ui_g_Text_FRIC->color = 2;
    ui_g_Text_FRIC->str_length = 4;
    ui_g_Text_FRIC->width = 2;
    strcpy(ui_g_Text_FRIC->string, "FRIC");

    ui_g_Text_CAP->figure_tpye = 7;
    ui_g_Text_CAP->layer = 0;
    ui_g_Text_CAP->font_size = 26;
    ui_g_Text_CAP->start_x = 751;
    ui_g_Text_CAP->start_y = 193;
    ui_g_Text_CAP->color = 6;
    ui_g_Text_CAP->str_length = 3;
    ui_g_Text_CAP->width = 3;
    strcpy(ui_g_Text_CAP->string, "CAP");

    ui_g_Text_PTE->figure_tpye = 7;
    ui_g_Text_PTE->layer = 0;
    ui_g_Text_PTE->font_size = 26;
    ui_g_Text_PTE->start_x = 1850;
    ui_g_Text_PTE->start_y = 770;
    ui_g_Text_PTE->color = 2;
    ui_g_Text_PTE->str_length = 3;
    ui_g_Text_PTE->width = 3;
    strcpy(ui_g_Text_PTE->string, "PTE");

    ui_g_Text_JUP->figure_tpye = 7;
    ui_g_Text_JUP->layer = 0;
    ui_g_Text_JUP->font_size = 26;
    ui_g_Text_JUP->start_x = 1760;
    ui_g_Text_JUP->start_y = 705;
    ui_g_Text_JUP->color = 2;
    ui_g_Text_JUP->str_length = 3;
    ui_g_Text_JUP->width = 3;
    strcpy(ui_g_Text_JUP->string, "JUP");

    ui_g_Text_PWR->figure_tpye = 7;
    ui_g_Text_PWR->layer = 0;
    ui_g_Text_PWR->font_size = 26;
    ui_g_Text_PWR->start_x = 1725;
    ui_g_Text_PWR->start_y = 600;
    ui_g_Text_PWR->color = 2;
    ui_g_Text_PWR->str_length = 3;
    ui_g_Text_PWR->width = 3;
    strcpy(ui_g_Text_PWR->string, "PWR");

    ui_g_Text_WHE->figure_tpye = 7;
    ui_g_Text_WHE->layer = 0;
    ui_g_Text_WHE->font_size = 26;
    ui_g_Text_WHE->start_x = 1760;
    ui_g_Text_WHE->start_y = 495;
    ui_g_Text_WHE->color = 2;
    ui_g_Text_WHE->str_length = 3;
    ui_g_Text_WHE->width = 3;
    strcpy(ui_g_Text_WHE->string, "WHE");

    ui_g_Text_LES->figure_tpye = 7;
    ui_g_Text_LES->layer = 0;
    ui_g_Text_LES->font_size = 26;
    ui_g_Text_LES->start_x = 1850;
    ui_g_Text_LES->start_y = 415;
    ui_g_Text_LES->color = 2;
    ui_g_Text_LES->str_length = 3;
    ui_g_Text_LES->width = 3;
    strcpy(ui_g_Text_LES->string, "LES");

    ui_g_Ungroup_NewText->figure_tpye = 7;
    ui_g_Ungroup_NewText->layer = 0;
    ui_g_Ungroup_NewText->font_size = 20;
    ui_g_Ungroup_NewText->start_x = 107;
    ui_g_Ungroup_NewText->start_y = 676;
    ui_g_Ungroup_NewText->color = 0;
    ui_g_Ungroup_NewText->str_length = 8;
    ui_g_Ungroup_NewText->width = 2;
    strcpy(ui_g_Ungroup_NewText->string, "SPEEDLIM");


    uint32_t idx = 0;
    for (int i = 0; i < TOTAL_FIGURE; i++) {
        ui_g_now_figures[i].figure_name[2] = idx & 0xFF;
        ui_g_now_figures[i].figure_name[1] = (idx >> 8) & 0xFF;
        ui_g_now_figures[i].figure_name[0] = (idx >> 16) & 0xFF;
        ui_g_now_figures[i].operate_tpyel = 1;
#ifndef MANUAL_DIRTY
        ui_g_last_figures[i] = ui_g_now_figures[i];
#endif
        ui_g_dirty_figure[i] = 1;
        idx++;
    }
    for (int i = 0; i < TOTAL_STRING; i++) {
        ui_g_now_strings[i].figure_name[2] = idx & 0xFF;
        ui_g_now_strings[i].figure_name[1] = (idx >> 8) & 0xFF;
        ui_g_now_strings[i].figure_name[0] = (idx >> 16) & 0xFF;
        ui_g_now_strings[i].operate_tpyel = 1;
#ifndef MANUAL_DIRTY
        ui_g_last_strings[i] = ui_g_now_strings[i];
#endif
        ui_g_dirty_string[i] = 1;
        idx++;
    }

    ui_scan_and_send(ui_g_now_figures, ui_g_dirty_figure, ui_g_now_strings, ui_g_dirty_string, TOTAL_FIGURE, TOTAL_STRING);

    for (int i = 0; i < TOTAL_FIGURE; i++) {
        ui_g_now_figures[i].operate_tpyel = 2;
    }
    for (int i = 0; i < TOTAL_STRING; i++) {
        ui_g_now_strings[i].operate_tpyel = 2;
    }
}

void ui_update_g() {
#ifndef MANUAL_DIRTY
    for (int i = 0; i < TOTAL_FIGURE; i++) {
        if (memcmp(&ui_g_now_figures[i], &ui_g_last_figures[i], sizeof(ui_g_now_figures[i])) != 0) {
            ui_g_dirty_figure[i] = 1;
            ui_g_last_figures[i] = ui_g_now_figures[i];
        }
    }
    for (int i = 0; i < TOTAL_STRING; i++) {
        if (memcmp(&ui_g_now_strings[i], &ui_g_last_strings[i], sizeof(ui_g_now_strings[i])) != 0) {
            ui_g_dirty_string[i] = 1;
            ui_g_last_strings[i] = ui_g_now_strings[i];
        }
    }
#endif
    ui_scan_and_send(ui_g_now_figures, ui_g_dirty_figure, ui_g_now_strings, ui_g_dirty_string, TOTAL_FIGURE, TOTAL_STRING);
}
